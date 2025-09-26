if ($env:REHOME_AGENT -eq "storm" -or $env:STORM_AGENT) {
  if ($env:STORM_ALLOW_WRITE -ne "1") {
    Write-Error "🔒 pre-commit: Storm READ-ONLY. Set STORM_ALLOW_WRITE=1 to commit."
    exit 1
  }
}
exit 0
