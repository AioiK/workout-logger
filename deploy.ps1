# deploy.ps1
Set-Location $PSScriptRoot

# 1. version.json 更新
$ver = Get-Date -Format "yyyy.MM.dd.HHmm"
@{ version = $ver } | ConvertTo-Json | Set-Content "version.json" -Encoding UTF8
Write-Host "New Version: $ver" -ForegroundColor Green

# 2. git add, commit, push
git add index.html workout_logger.html version.json deploy.ps1
git commit -m "feat: remove sunny jog duration stepper and link with Mi Band ($ver)"
git push origin main

Write-Host "Deploy completed! GitHub Pages updated." -ForegroundColor Cyan
