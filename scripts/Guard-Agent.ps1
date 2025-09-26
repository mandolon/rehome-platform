param([Parameter(Mandatory=$false)][string]$Cmd)
if ($env:REHOME_AGENT -ne "cursor") {
  Write-Error "This terminal is not the Cursor shell (REHOME_AGENT=$($env:REHOME_AGENT)). Open task: 'Cursor Shell (Dedicated)'."
  exit 1
}
if ($Cmd) {
  Invoke-Expression $Cmd
}

