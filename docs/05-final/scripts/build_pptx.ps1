param(
  [Parameter(Mandatory = $true)][string]$SpecPath,
  [Parameter(Mandatory = $true)][string]$OutPptx,
  [Parameter(Mandatory = $true)][string]$PngDir
)
# Builds the Team A defence deck through PowerPoint COM from deck.json (scratch tooling, not project code).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$spec = Get-Content -Raw -Encoding UTF8 $SpecPath | ConvertFrom-Json
function RGBc([int]$r, [int]$g, [int]$b) { return $r + 256 * $g + 65536 * $b }
$NAVY = RGBc 22 42 110; $BLUE = RGBc 29 78 216; $PALE = RGBc 226 234 252; $INK = RGBc 17 24 39; $GREY = RGBc 75 85 99
$WHITE = RGBc 255 255 255; $AMBER = RGBc 245 158 11; $AMBERPALE = RGBc 254 243 205; $YEL = RGBc 255 242 134; $BG = RGBc 247 248 251
$GREEN = RGBc 21 128 61; $LINE = RGBc 190 198 214
$FONT = 'Calibri'

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $null
try {
  $pres = $ppt.Presentations.Add(0)
  $pres.PageSetup.SlideWidth = 960; $pres.PageSetup.SlideHeight = 540
  $blank = $pres.SlideMaster.CustomLayouts.Item(7)

  function Box($s, $x, $y, $w, $h, $fill, $shape = 1, $line = $null, $name = '') {
    $b = $s.Shapes.AddShape($shape, $x, $y, $w, $h)
    $b.Fill.ForeColor.RGB = $fill; $b.Fill.Solid()
    if ($line -ne $null) { $b.Line.ForeColor.RGB = $line; $b.Line.Weight = 1 } else { $b.Line.Visible = 0 }
    $b.Shadow.Visible = 0
    if ($shape -eq 5) { $b.Adjustments.Item(1) = 0.06 }
    if ($name) { $b.Name = $name }
    return $b
  }
  function Txt($s, $x, $y, $w, $h, $text, $size, $bold, $color, $align = 1, $anchor = 1, $name = '') {
    $t = $s.Shapes.AddTextbox(1, $x, $y, $w, $h)
    $t.TextFrame.WordWrap = -1; $t.TextFrame.AutoSize = 0
    $t.Left = $x; $t.Top = $y; $t.Width = $w; $t.Height = $h
    $t.TextFrame.MarginLeft = 0; $t.TextFrame.MarginRight = 0; $t.TextFrame.MarginTop = 0; $t.TextFrame.MarginBottom = 0
    $t.TextFrame.VerticalAnchor = $anchor
    $r = $t.TextFrame.TextRange; $r.Text = $text
    $r.Font.Name = $FONT; $r.Font.Size = $size; $r.Font.Bold = [int]$bold * -1; $r.Font.Color.RGB = $color
    $r.ParagraphFormat.Alignment = $align
    if ($name) { $t.Name = $name }
    return $t
  }
  function Bul($s, $x, $y, $w, $h, $items, $size, $color, $gap = 6, $name = '') {
    $t = Txt $s $x $y $w $h ($items -join "`r") $size $false $color 1 1 $name
    $tr = $t.TextFrame2.TextRange
    $tr.ParagraphFormat.Bullet.Visible = -1; $tr.ParagraphFormat.Bullet.Character = 8226
    $tr.ParagraphFormat.LeftIndent = 16; $tr.ParagraphFormat.FirstLineIndent = -16
    $tr.ParagraphFormat.SpaceAfter = $gap
    return $t
  }
  function Pic($s, $path, $x, $y, $mw, $mh, $alt) {
    $path = $path.Replace('/', [string][char]92)
    if (-not (Test-Path $path)) { throw "missing image $path" }
    $img = [System.Drawing.Image]::FromFile($path); $iw = $img.Width; $ih = $img.Height; $img.Dispose()
    $sc = [Math]::Min($mw / $iw, $mh / $ih); $w = $iw * $sc; $h = $ih * $sc
    $p = $s.Shapes.AddPicture($path, 0, -1, $x + ($mw - $w) / 2, $y + ($mh - $h) / 2, $w, $h)
    $p.AlternativeText = $alt; $p.Line.ForeColor.RGB = $LINE; $p.Line.Weight = 0.75
    return $p
  }
  function Chip($s, $x, $y, $w, $h, $text, $size = 14) {
    $c = Box $s $x $y $w $h $YEL 5 (RGBc 200 160 0) 'Placeholder'
    $c.TextFrame.TextRange.Text = $text
    $c.TextFrame.TextRange.Font.Name = $FONT; $c.TextFrame.TextRange.Font.Size = $size; $c.TextFrame.TextRange.Font.Color.RGB = $INK
    $c.TextFrame.MarginLeft = 4; $c.TextFrame.MarginRight = 4; $c.TextFrame.WordWrap = -1
    return $c
  }
  function Title($s, $text, $color) { return Txt $s 48 26 864 56 $text 34 $true $color 1 3 'Title' }
  function Footer($s, $n, $dark) {
    $c = if ($dark) { RGBc 170 185 225 } else { $GREY }
    Txt $s 48 506 600 20 'Team A  |  Basic Calculator Application' 11 $false $c 1 1 'Footer' | Out-Null
    Txt $s 852 506 60 20 ([string]$n) 11 $false $c 3 1 'SlideNumber' | Out-Null
  }

  $i = 0
  foreach ($d in $spec) {
    $i++
    $s = $pres.Slides.AddSlide($i, $blank)
    $dark = ($d.layout -eq 'title' -or $d.layout -eq 'close')
    $s.FollowMasterBackground = 0
    $s.Background.Fill.ForeColor.RGB = $(if ($dark) { $NAVY } else { $WHITE }); $s.Background.Fill.Solid()
    $tc = $(if ($dark) { $WHITE } else { $NAVY })

    switch ($d.layout) {
      'title' {
        Txt $s 56 110 560 150 $d.title 54 $true $WHITE 1 1 'Title' | Out-Null
        Txt $s 56 275 560 60 $d.subtitle 20 $false (RGBc 205 218 250) 1 1 'Subtitle' | Out-Null
        Txt $s 56 345 560 30 $d.line 20 $true (RGBc 252 200 90) 1 1 'DefenceDate' | Out-Null
        $p = Pic $s "$($d.shot)" 700 40 212 420 'Screenshot of the calculator showing the result 20'
        $x = 56
        foreach ($c in $d.chips) { Chip $s $x 430 150 36 $c 13 | Out-Null; $x += 158 }
        # five chips of 150 wide would reach 56+790; keep clear of the screenshot
      }
      'cards' {
        Title $s $d.title $tc | Out-Null
        Bul $s 48 104 864 130 $d.bullets 20 $INK 8 'Bullets' | Out-Null
        $x = 48
        foreach ($c in $d.cards) {
          $b = Box $s $x 252 272 130 $PALE 5 $null 'Card'
          Txt $s ($x + 16) 266 240 30 $c[0] 22 $true $NAVY 1 1 | Out-Null
          Txt $s ($x + 16) 304 240 70 $c[1] 17 $false $INK 1 1 | Out-Null
          $x += 296
        }
        $co = Box $s 48 408 864 64 $AMBERPALE 5 $AMBER 'Callout'
        Txt $s 66 408 828 64 $d.callout 16 $false $INK 1 3 | Out-Null
        Footer $s $i $false
      }
      'research' {
        Title $s $d.title $tc | Out-Null
        Txt $s 48 92 864 22 'Three existing calculators we studied' 16 $true $GREY 1 1 | Out-Null
        $x = 48
        foreach ($c in $d.products) {
          Box $s $x 120 272 140 $PALE 5 $null 'Card' | Out-Null
          Txt $s ($x + 16) 132 240 26 $c[0] 19 $true $NAVY 1 1 | Out-Null
          Txt $s ($x + 16) 164 240 90 $c[1] 16 $false $INK 1 1 | Out-Null
          $x += 296
        }
        $x = 48
        foreach ($c in $d.stats) {
          Box $s $x 284 272 118 $WHITE 5 $LINE 'Stat' | Out-Null
          Txt $s ($x + 8) 292 256 60 $c[0] 44 $true $BLUE 2 3 | Out-Null
          Txt $s ($x + 8) 356 256 40 $c[1] 15 $false $INK 2 1 | Out-Null
          $x += 296
        }
        Txt $s 48 424 864 40 $d.note 15 $false $GREY 1 1 'SourceNote' | Out-Null
        Footer $s $i $false
      }
      'arch' {
        Title $s $d.title $tc | Out-Null
        Pic $s $d.image 48 92 864 350 'Architecture diagram: the user acts on the interface layer (index.html, styles.css, keymap.js, app.js), which exchanges key names, states and display text with the calculation layer (engine.js, format.js)' | Out-Null
        Txt $s 48 456 864 30 $d.line 16 $false $GREY 2 1 'Caption' | Out-Null
        Footer $s $i $false
      }
      'shots' {
        Title $s $d.title $tc | Out-Null
        $x = 48
        foreach ($im in $d.images) { Pic $s $im $x 92 190 300 'Calculator screenshot' | Out-Null; $x += 204 }
        Txt $s 48 408 600 22 'Typing 7 + 8   |   result 20 for 2 + 3 x 4   |   error for 5 / 0' 13 $false $GREY 1 1 'Caption' | Out-Null
        Bul $s 676 112 236 300 $d.bullets 17 $INK 12 'Bullets' | Out-Null
        Footer $s $i $false
      }
      'demo' {
        Title $s $d.title $tc | Out-Null
        $y = 98; $n = 0
        foreach ($st in $d.steps) {
          $n++
          $c = Box $s 48 ($y + 4) 30 30 $BLUE 9 $null 'StepNumber'
          $c.TextFrame.TextRange.Text = [string]$n; $c.TextFrame.TextRange.Font.Size = 15; $c.TextFrame.TextRange.Font.Bold = -1
          $c.TextFrame.TextRange.Font.Name = $FONT; $c.TextFrame.TextRange.Font.Color.RGB = $WHITE
          $c.TextFrame.MarginLeft = 0; $c.TextFrame.MarginRight = 0
          Txt $s 92 $y 300 38 $st[0] 17 $true $INK 1 3 | Out-Null
          Txt $s 400 $y 232 38 $st[1] 15 $false $GREY 1 3 | Out-Null
          $y += 49
        }
        Box $s 656 98 256 300 $AMBERPALE 5 $AMBER 'Fallback' | Out-Null
        Txt $s 672 110 224 28 'If it fails' 20 $true $NAVY 1 1 | Out-Null
        $fb = @($d.fallback | Select-Object -Skip 1)
        Txt $s 672 142 224 40 $d.fallback[0] 15 $true $INK 1 1 | Out-Null
        Bul $s 672 176 224 210 $fb 16 $INK 10 'FallbackSteps' | Out-Null
        Footer $s $i $false
      }
      'stats' {
        Title $s $d.title $tc | Out-Null
        $x = 48
        foreach ($c in $d.stats) {
          Box $s $x 96 204 134 $PALE 5 $null 'Stat' | Out-Null
          Txt $s ($x + 8) 104 188 58 $c[0] 40 $true $BLUE 2 3 | Out-Null
          Txt $s ($x + 10) 168 184 56 $c[1] 14 $false $INK 2 1 | Out-Null
          $x += 220
        }
        Box $s 48 256 864 174 $WHITE 5 $LINE 'BugPanel' | Out-Null
        Txt $s 68 268 824 28 $d.bugtitle 20 $true $NAVY 1 1 | Out-Null
        Bul $s 68 306 824 120 $d.bugs 18 $INK 8 'Bullets' | Out-Null
        $nb = Box $s 48 444 864 44 $AMBERPALE 5 $AMBER 'Honesty'
        Txt $s 66 444 828 44 $d.note 15 $false $INK 1 3 | Out-Null
        Footer $s $i $false
      }
      'cols3' {
        Title $s $d.title $tc | Out-Null
        $x = 48
        foreach ($c in $d.cols) {
          Box $s $x 110 272 330 $PALE 5 $null 'Column' | Out-Null
          Txt $s ($x + 16) 124 240 30 $c[0] 24 $true $NAVY 1 1 | Out-Null
          Bul $s ($x + 16) 168 240 260 $c[1] 17 $INK 10 'Bullets' | Out-Null
          $x += 296
        }
        Footer $s $i $false
      }
      'close' {
        Title $s $d.title $tc | Out-Null
        Bul $s 56 108 840 160 $d.lessons 22 $WHITE 12 'Lessons' | Out-Null
        Box $s 56 272 848 76 (RGBc 38 62 140) 5 $null 'Conclusion' | Out-Null
        Txt $s 76 272 808 76 $d.concl 20 $true (RGBc 252 200 90) 1 3 | Out-Null
        Txt $s 56 364 840 22 'Each team member: one lesson in your own words' 15 $false (RGBc 205 218 250) 1 1 | Out-Null
        $x = 56
        foreach ($c in $d.chips) { Chip $s $x 392 160 52 $c 13 | Out-Null; $x += 172 }
        Txt $s 56 458 840 24 'Thank you. Questions are welcome.' 20 $true $WHITE 1 1 | Out-Null
        Footer $s $i $true
      }
    }
    $s.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text = ($d.notes -replace "`r?`n", "`r")
  }
  $props = $pres.BuiltInDocumentProperties
  foreach ($kv in @(@('Title', 'Team A Basic Calculator Application: defence presentation (DRAFT, not approved)'), @('Subject', 'Specialization Project IN.MSA.CBS.006'), @('Comments', 'DRAFT 0.2 corrected on 31 October 2026 after the academic audit. Prepared with an AI assistant. Not reviewed by the five students or approved by the project lead.'))) {
    $item = [System.__ComObject].InvokeMember('Item', 'GetProperty', $null, $props, @($kv[0]))
    [System.__ComObject].InvokeMember('Value', 'SetProperty', $null, $item, @($kv[1])) | Out-Null
  }
  $pres.SaveAs($OutPptx)
  New-Item -ItemType Directory -Force $PngDir | Out-Null
  $k = 0
  foreach ($sl in $pres.Slides) { $k++; $sl.Export((Join-Path $PngDir ("slide-{0:00}.png" -f $k)), 'PNG', 1600, 900) }
  Write-Output "slides=$($pres.Slides.Count)"
}
finally {
  if ($pres) { $pres.Close() }
  $ppt.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
