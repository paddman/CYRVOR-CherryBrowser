param(
  [Parameter(Mandatory = $true)]
  [string]$Executable
)

$ErrorActionPreference = 'Stop'
$exe = (Resolve-Path $Executable).Path
$profile = Join-Path $env:RUNNER_TEMP ("cherry-packaged-smoke-" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$previousProfile = $env:CHERRY_TEST_PROFILE
$process = $null

try {
  $env:CHERRY_TEST_PROFILE = $profile
  $process = Start-Process -FilePath $exe -PassThru

  $windowDeadline = [DateTime]::UtcNow.AddSeconds(30)
  do {
    Start-Sleep -Milliseconds 250
    $process.Refresh()
    if ($process.HasExited) {
      throw "Packaged Cherry exited before creating its main window (exit code $($process.ExitCode))"
    }
  } while ($process.MainWindowHandle -eq 0 -and [DateTime]::UtcNow -lt $windowDeadline)

  if ($process.MainWindowHandle -eq 0) {
    throw 'Packaged Cherry did not create a native main window within 30 seconds'
  }

  $process.Refresh()
  $title = [string]$process.MainWindowTitle
  if ($title -notmatch 'Cherry') {
    throw "Unexpected packaged window title: '$title'"
  }

  $profileFile = Join-Path $profile 'cherry-data.json'
  $profileDeadline = [DateTime]::UtcNow.AddSeconds(15)
  while (-not (Test-Path $profileFile) -and [DateTime]::UtcNow -lt $profileDeadline) {
    Start-Sleep -Milliseconds 250
  }
  if (-not (Test-Path $profileFile)) {
    throw 'Packaged Cherry opened a window but did not initialize its isolated test profile'
  }

  $data = Get-Content -Raw -Path $profileFile | ConvertFrom-Json
  if ([int]$data.schemaVersion -lt 4) {
    throw "Unexpected packaged profile schema: $($data.schemaVersion)"
  }
  if (-not $data.workspaces -or $data.workspaces.Count -lt 1) {
    throw 'Packaged Cherry profile did not contain the expected default workspace'
  }

  Write-Host "Packaged Cherry started successfully"
  Write-Host "Window title: $title"
  Write-Host "Profile schema: $($data.schemaVersion)"

  if (-not $process.CloseMainWindow()) {
    throw 'Unable to request a graceful close from the packaged Cherry window'
  }
  if (-not $process.WaitForExit(15000)) {
    throw 'Packaged Cherry did not exit after its main window was closed'
  }
  if ($process.ExitCode -ne 0) {
    throw "Packaged Cherry exited with code $($process.ExitCode)"
  }
} finally {
  if ($process -and -not $process.HasExited) {
    try { $process.Kill($true) } catch { }
  }
  if ($null -eq $previousProfile) {
    Remove-Item Env:CHERRY_TEST_PROFILE -ErrorAction SilentlyContinue
  } else {
    $env:CHERRY_TEST_PROFILE = $previousProfile
  }
  Remove-Item -Recurse -Force -Path $profile -ErrorAction SilentlyContinue
}
