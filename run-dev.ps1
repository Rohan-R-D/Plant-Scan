<#
PowerShell helper to run the app with guidance for Google Generative AI credentials.
Usage: open PowerShell, then run `.
un-dev.ps1` from the project root.
#>
Write-Host "Starting Plant Analysis Tool (dev helper)" -ForegroundColor Cyan

# If GOOGLE_APPLICATION_CREDENTIALS is not set, prompt for a path to a service account JSON
if (-not $env:GOOGLE_APPLICATION_CREDENTIALS) {
    Write-Host "GOOGLE_APPLICATION_CREDENTIALS is not set." -ForegroundColor Yellow
    $choice = Read-Host "Do you want to set a service account JSON path now? (Y/n)"
    if ($choice -eq "" -or $choice -match '^[Yy]') {
        $path = Read-Host "Enter absolute path to service account JSON file (or press Enter to skip)"
        if ($path -and (Test-Path $path)) {
            $env:GOOGLE_APPLICATION_CREDENTIALS = $path
            Write-Host "Set GOOGLE_APPLICATION_CREDENTIALS=$path" -ForegroundColor Green
        } elseif ($path) {
            Write-Host "Path not found: $path" -ForegroundColor Red
        } else {
            Write-Host "Skipping service account setup. You can run 'gcloud auth application-default login' for testing." -ForegroundColor Yellow
        }
    }
}

Write-Host "Installing dependencies (if needed)..." -ForegroundColor Cyan
npm install

Write-Host "Starting server..." -ForegroundColor Cyan
node app.js