param([Parameter(Mandatory=$true)][string]$Docx)
$ErrorActionPreference='Stop'
$w = New-Object -ComObject Word.Application; $w.Visible=$false; $w.DisplayAlerts=0
try {
  $d = $w.Documents.Open($Docx, $false, $true)
  $d.Repaginate()
  $n = $d.ComputeStatistics(2)
  "pages=$n words=$($d.ComputeStatistics(0)) tables=$($d.Tables.Count) inlineShapes=$($d.InlineShapes.Count) fields=$($d.Fields.Count)"
  for ($p=1; $p -le $n; $p++) {
    $s = $d.GoTo(1,1,$p).Start
    $e = if ($p -lt $n) { $d.GoTo(1,1,$p+1).Start - 1 } else { $d.Content.End - 1 }
    if ($e -lt $s) { $e = $s }
    $r = $d.Range($s,$e)
    $chars = $r.Text.Length
    $endr = $d.Range($e,$e)
    $y = $endr.Information(6)
    $img = $r.InlineShapes.Count
    $first = ($r.Text -replace '[\r\n\a]+',' ').Trim(); if ($first.Length -gt 50) { $first = $first.Substring(0,50) }
    "{0,3} chars={1,5} endY={2,6} imgs={3} | {4}" -f $p,$chars,$y,$img,$first
  }
  $d.Close($false)
} finally { $w.Quit() }
