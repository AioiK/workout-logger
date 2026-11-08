# deploy.ps1
param (
    [string]$msg = "feat: update stretch sequence timer (manual start with 3s prep) and remove metronome"
)
Set-Location $PSScriptRoot

# 1. version.json 更新
$ver = Get-Date -Format "yyyy.MM.dd.HHmm"
@{ version = $ver } | ConvertTo-Json | Set-Content "version.json" -Encoding UTF8
Write-Host "New Version: $ver" -ForegroundColor Green

# 2. git add, commit, push
git add index.html workout_logger.html version.json deploy.ps1
git commit -m "$msg ($ver)"
git push origin main

Write-Host "Deploy completed! GitHub Pages updated." -ForegroundColor Cyan
