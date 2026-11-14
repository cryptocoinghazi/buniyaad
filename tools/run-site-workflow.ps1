param(
  [Parameter(Mandatory = $true)][int]$Port,
  [Parameter(Mandatory = $true)][string]$ProjectId,
  [Parameter(Mandatory = $true)][string]$Root,
  [Parameter(Mandatory = $true)][string]$NodePath,
  [Parameter(Mandatory = $true)][string]$HelperPath
)

$ErrorActionPreference = 'Stop'

$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)

try {
  $listener.Start()
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::UTF8, $false, 4096, $true)
  $payload = $reader.ReadLine()
  if ([string]::IsNullOrWhiteSpace($payload)) { throw 'No workflow payload was received.' }

  $startInfo = [Diagnostics.ProcessStartInfo]::new()
  $startInfo.FileName = $NodePath
  $startInfo.WorkingDirectory = $Root
  $startInfo.UseShellExecute = $false
  $startInfo.CreateNoWindow = $true
  $startInfo.RedirectStandardInput = $true
  $startInfo.RedirectStandardOutput = $true
  $startInfo.RedirectStandardError = $true
  $startInfo.Arguments = ('"{0}" --project-id "{1}"' -f $HelperPath, $ProjectId)

  $process = [Diagnostics.Process]::Start($startInfo)
  $outputLines = [Collections.Generic.List[string]]::new()

  # The helper writes its readiness prompt to stderr. Supplying stdin as soon as
  # the process starts avoids blocking while keeping the credential in memory.
  $process.StandardInput.WriteLine($payload)
  $process.StandardInput.Close()
  $payload = $null

  while (-not $process.StandardOutput.EndOfStream) {
    $line = $process.StandardOutput.ReadLine()
    $outputLines.Add($line)
  }

  $errorText = $process.StandardError.ReadToEnd()
  $process.WaitForExit()
  if ($process.ExitCode -ne 0) {
    $safeError = ($errorText + "`n" + ($outputLines -join "`n")) -replace 'art_v2_[A-Za-z0-9_]+', '[redacted]'
    throw "Site workflow exited with code $($process.ExitCode): $safeError"
  }

  $finalJson = $outputLines | Where-Object { $_ -match '^\s*\{' } | Select-Object -Last 1
  if (-not $finalJson) { throw 'Site workflow completed without a final JSON result.' }
  Write-Output $finalJson
}
finally {
  if ($reader) { $reader.Dispose() }
  if ($client) { $client.Dispose() }
  $listener.Stop()
}
