# deploy.ps1
Set-Location $PSScriptRoot

# 1. workout_logger.html -> index.html
Copy-Item "workout_logger.html" "index.html" -Force

# 2. version.json
$ver = Get-Date -Format "yyyy.MM.dd.HHmm"
@{ version = $ver } | ConvertTo-Json | Set-Content "version.json" -Encoding UTF8
Write-Host "New Version: $ver" -ForegroundColor Green

# 3. git add, commit, push
git add .
git commit -m "Auto deploy: $ver"
git push origin main

Write-Host "Deploy completed! GitHub Pages updated." -ForegroundColor Cyan