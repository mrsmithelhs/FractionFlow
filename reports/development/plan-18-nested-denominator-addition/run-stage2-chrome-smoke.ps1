$serverOut = Join-Path $PSScriptRoot 'vite-smoke-server.log'
$serverErr = Join-Path $PSScriptRoot 'vite-smoke-server-error.log'
$server = Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' `
  -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5178', '--strictPort') `
  -WorkingDirectory (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path `
  -WindowStyle Hidden -RedirectStandardOutput $serverOut -RedirectStandardError $serverErr -PassThru
try {
  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try {
      $null = Invoke-WebRequest -Uri 'http://127.0.0.1:5178/FractionFlow/' -TimeoutSec 2
      $ready = $true
      break
    } catch { Start-Sleep -Milliseconds 250 }
  }
  if (-not $ready) { throw "Vite did not become ready. See $serverErr" }
  node (Join-Path $PSScriptRoot 'stage2-chrome-smoke.mjs')
  if ($LASTEXITCODE -ne 0) { throw "Chrome smoke failed with exit code $LASTEXITCODE" }
} finally {
  if (-not $server.HasExited) { Stop-Process -Id $server.Id -Force }
}
