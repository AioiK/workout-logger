// 筋トレログ サービスワーカー (sw.js)
let swRestTimerId = null;
let swRestTimerResolve = null;

function clearSwRestTimer() {
  if (swRestTimerId !== null) {
    clearTimeout(swRestTimerId);
    swRestTimerId = null;
  }
  if (swRestTimerResolve) {
    const resolve = swRestTimerResolve;
    swRestTimerResolve = null;
    resolve();
  }
}

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// 休憩タイマーの独立バックグラウンド通知（メインスレッド凍結時の保険）
self.addEventListener('message', event => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.action === 'schedule_rest_timer') {
    clearSwRestTimer();
    const targetTime = Number(data.targetTime) || 0;
    const delayMs = Math.max(0, targetTime - Date.now());
    const title = data.title || '⏱️ 筋トレタイマー終了！';
    const body = data.body || '休憩時間が終了しました。次のセットを開始してください！';

    const p = new Promise(resolve => {
      swRestTimerResolve = resolve;
      swRestTimerId = setTimeout(async () => {
        swRestTimerId = null;
        try {
          await self.registration.showNotification(title, {
            body: body,
            icon: './icon.svg',
            vibrate: [300, 150, 300, 150, 500],
            tag: 'workout-rest-timer',
            renotify: true,
            requireInteraction: true,
            silent: false,
            data: { targetTime }
          });
        } catch (err) {
          console.warn('SW rest timer notification failed:', err);
        } finally {
          if (swRestTimerResolve) {
            const done = swRestTimerResolve;
            swRestTimerResolve = null;
            done();
          }
        }
      }, delayMs);
    });

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(p);
    }
  } else if (data.action === 'cancel_rest_timer') {
    clearSwRestTimer();
  }
});

// 通知がタップされた時にアプリを開く
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
