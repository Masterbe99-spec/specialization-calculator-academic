param([Parameter(Mandatory=$true)][string]$Pptx)
$ErrorActionPreference = 'Stop'
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $p = $ppt.Presentations.Open($Pptx, -1, 0, 0)   # read-only, untitled, no window
  "slides=$($p.Slides.Count) size=$($p.PageSetup.SlideWidth)x$($p.PageSetup.SlideHeight)"
  $minFont = 999; $out = 0; $draftText = 0; $ph = 0; $noAlt = 0
  foreach ($s in $p.Slides) {
    $notes = $s.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text
    $words = ($notes -split '\s+' | ? { $_ }).Count
    $sm = 999; $slideOut = 0
    foreach ($sh in $s.Shapes) {
      if ($sh.Left -lt -0.5 -or $sh.Top -lt -0.5 -or ($sh.Left + $sh.Width) -gt 960.5 -or ($sh.Top + $sh.Height) -gt 540.5) { $slideOut++; $out++ }
      if ($sh.Type -eq 13 -and -not $sh.AlternativeText) { $noAlt++ }
      if ($sh.HasTextFrame -and $sh.TextFrame.HasText) {
        $t = $sh.TextFrame.TextRange.Text
        foreach ($run in $sh.TextFrame.TextRange.Runs()) { if ($run.Font.Size -lt $sm) { $sm = $run.Font.Size } }
        if ($t -match 'Draft for team review') { $draftText++ }
        if ($t -match '^\[.*\]$') { $ph++ }
      }
    }
    if ($sm -lt $minFont) { $minFont = $sm }
    "slide {0}: shapes={1} notesWords={2} minFont={3} outOfBounds={4}" -f $s.SlideIndex, $s.Shapes.Count, $words, $sm, $slideOut
  }
  "minFontOverall=$minFont outOfBounds=$out draftFooterLeft=$draftText placeholderBoxes=$ph picturesWithoutAlt=$noAlt"
  $props = $p.BuiltInDocumentProperties
  foreach ($n in 'Title', 'Comments') { $item = [System.__ComObject].InvokeMember('Item', 'GetProperty', $null, $props, @($n)); "$n = " + [System.__ComObject].InvokeMember('Value', 'GetProperty', $null, $item, $null) }
  $p.Close()
} finally { $ppt.Quit() }
