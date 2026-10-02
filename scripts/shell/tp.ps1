# scripts/shell/tp.ps1
# Usage: add `. C:\path\to\repo\scripts\shell\tp.ps1` to $PROFILE.

$_tpHere = Split-Path -Parent $PSCommandPath
$_tpRoot = (Resolve-Path (Join-Path $_tpHere '../..')).Path

function tp {
    $root = (git rev-parse --show-toplevel 2>$null)
    if (-not $root) { $root = $_tpRoot }

    $script = Join-Path $root 'scripts/tp.mjs'
    if (-not (Test-Path $script)) { Write-Error "tp: $script not found"; return }

    $rf = [System.IO.Path]::GetTempFileName()
    try {
        $env:TP_RESULT_FILE = $rf
        node $script
        if ($LASTEXITCODE -ne 0) { return }
        $target = (Get-Content $rf -Raw).Trim()
        if ($target -and (Test-Path $target -PathType Container)) {
            Set-Location $target
        } else {
            Write-Error "tp: invalid target '$target'"
        }
    } finally {
        Remove-Item Env:\TP_RESULT_FILE -ErrorAction SilentlyContinue
        Remove-Item $rf -ErrorAction SilentlyContinue
    }
}