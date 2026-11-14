param(
  [string]$Root = (Join-Path $PSScriptRoot '..\dist'),
  [int]$Port = 4173
)

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  $nodePath = $nodeCommand.Source
}
else {
  $runtimeNode = Get-ChildItem -Path "$env:LOCALAPPDATA\OpenAI\Codex\runtimes" -Filter node.exe -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $runtimeNode) { throw 'Node.js is required for the local preview. Install Node.js or add node.exe to PATH.' }
  $nodePath = $runtimeNode.FullName
}

& $nodePath (Join-Path $PSScriptRoot 'serve.mjs') $Root $Port

