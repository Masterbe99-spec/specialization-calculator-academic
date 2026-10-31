param(
  [Parameter(Mandatory = $true)][string]$SpecPath,
  [Parameter(Mandatory = $true)][string]$OutDocx,
  [Parameter(Mandatory = $true)][string]$OutPdf
)
# Builds an editable Word document from a JSON content file by driving Microsoft Word.
# Scratch tooling (not project code). Blocks: cover, h1, h2, h3, p, bullets, numbered, table, image, imagerow, code, callout, pagebreak, toc.
$ErrorActionPreference = 'Stop'
$spec = Get-Content -Raw -Encoding UTF8 $SpecPath | ConvertFrom-Json

function RGBc([int]$r, [int]$g, [int]$b) { return $r + 256 * $g + 65536 * $b }
$NAVY = RGBc 30 58 138; $BLUE = RGBc 29 78 216; $GREY = RGBc 75 85 99; $LIGHT = RGBc 243 245 249; $PALEBLUE = RGBc 220 230 251
$WHITE = RGBc 255 255 255; $LINE = RGBc 190 196 208; $AMBER = RGBc 255 244 214; $BAND = RGBc 248 249 252

$word = New-Object -ComObject Word.Application
$doc = $null
try {
$word.Visible = $false
$word.DisplayAlerts = 0
$word.Options.AutoFormatAsYouTypeReplaceQuotes = $false
$word.Options.AutoFormatAsYouTypeApplyNumberedLists = $false
$word.Options.AutoFormatAsYouTypeApplyBulletedLists = $false
$word.Options.AutoFormatAsYouTypeReplaceSymbols = $false
$word.Options.AutoFormatAsYouTypeReplaceHyperlinks = $false
$doc = $word.Documents.Add()
$sel = $word.Selection

# ---------- page and styles ----------
$ps = $doc.PageSetup
$ps.PaperSize = 7   # A4
$ps.TopMargin = 70.9; $ps.BottomMargin = 70.9; $ps.LeftMargin = 70.9; $ps.RightMargin = 70.9
$TEXTW = 595.3 - 2 * 70.9   # text width in points

$st = $doc.Styles
$n = $st.Item(-1); $n.Font.Name = 'Calibri'; $n.Font.Size = 11; $n.ParagraphFormat.SpaceAfter = 6; $n.ParagraphFormat.SpaceBefore = 0
$n.ParagraphFormat.LineSpacingRule = 5; $n.ParagraphFormat.LineSpacing = $word.LinesToPoints(1.12)
$h1 = $st.Item(-2); $h1.Font.Name = 'Calibri'; $h1.Font.Size = 22; $h1.Font.Bold = 1; $h1.Font.Color = $NAVY
$h1.ParagraphFormat.SpaceBefore = 0; $h1.ParagraphFormat.SpaceAfter = 14; $h1.ParagraphFormat.PageBreakBefore = -1; $h1.ParagraphFormat.KeepWithNext = -1
$h2 = $st.Item(-3); $h2.Font.Name = 'Calibri'; $h2.Font.Size = 15; $h2.Font.Bold = 1; $h2.Font.Color = $BLUE
$h2.ParagraphFormat.SpaceBefore = 16; $h2.ParagraphFormat.SpaceAfter = 6; $h2.ParagraphFormat.KeepWithNext = -1
$h3 = $st.Item(-4); $h3.Font.Name = 'Calibri'; $h3.Font.Size = 12; $h3.Font.Bold = 1; $h3.Font.Color = $GREY
$h3.ParagraphFormat.SpaceBefore = 10; $h3.ParagraphFormat.SpaceAfter = 4; $h3.ParagraphFormat.KeepWithNext = -1
$cap = $st.Item(-35); $cap.Font.Name = 'Calibri'; $cap.Font.Size = 9.5; $cap.Font.Italic = 0; $cap.Font.Bold = 0; $cap.Font.Color = $GREY
$cap.ParagraphFormat.SpaceBefore = 4; $cap.ParagraphFormat.SpaceAfter = 10
$tocH = $st.Add('FrontHeading', 1); $tocH.BaseStyle = 'Normal'; $tocH.Font.Size = 22; $tocH.Font.Bold = 1; $tocH.Font.Color = $NAVY; $tocH.ParagraphFormat.SpaceAfter = 12; $tocH.ParagraphFormat.PageBreakBefore = -1
$codeS = $st.Add('CodeBlock', 1); $codeS.BaseStyle = 'Normal'; $codeS.Font.Name = 'Consolas'; $codeS.Font.Size = 8.5
$codeS.ParagraphFormat.SpaceAfter = 0; $codeS.ParagraphFormat.LineSpacingRule = 0; $codeS.ParagraphFormat.LeftIndent = 8; $codeS.ParagraphFormat.Shading.BackgroundPatternColor = $LIGHT
$tagS = $st.Add('ElementTag', 1); $tagS.BaseStyle = 'Normal'; $tagS.Font.Size = 10; $tagS.Font.Bold = 1; $tagS.Font.Color = $WHITE
$tagS.ParagraphFormat.Shading.BackgroundPatternColor = $BLUE; $tagS.ParagraphFormat.SpaceAfter = 10; $tagS.ParagraphFormat.LeftIndent = 4; $tagS.ParagraphFormat.RightIndent = 4
$callS = $st.Add('Callout', 1); $callS.BaseStyle = 'Normal'; $callS.Font.Size = 10; $callS.ParagraphFormat.Shading.BackgroundPatternColor = $AMBER
$callS.ParagraphFormat.LeftIndent = 6; $callS.ParagraphFormat.RightIndent = 6; $callS.ParagraphFormat.SpaceBefore = 4; $callS.ParagraphFormat.SpaceAfter = 8
$noteS = $st.Add('NoteBox', 1); $noteS.BaseStyle = 'Normal'; $noteS.Font.Size = 10; $noteS.ParagraphFormat.Shading.BackgroundPatternColor = $PALEBLUE
$noteS.ParagraphFormat.LeftIndent = 6; $noteS.ParagraphFormat.RightIndent = 6; $noteS.ParagraphFormat.SpaceBefore = 4; $noteS.ParagraphFormat.SpaceAfter = 8
$lb = $st.Item(-49); $lb.Font.Name = 'Calibri'; $lb.ParagraphFormat.SpaceAfter = 3

function Set-Prop($name, $value) {
  $props = $doc.BuiltInDocumentProperties
  $item = [System.__ComObject].InvokeMember('Item', [System.Reflection.BindingFlags]::GetProperty, $null, $props, @($name))
  [System.__ComObject].InvokeMember('Value', [System.Reflection.BindingFlags]::SetProperty, $null, $item, @($value)) | Out-Null
}

# ---------- rich text ----------
function Parse-Rich([string]$text) {
  $tokens = [regex]::Split($text, '(\*\*.+?\*\*|\[\[.+?\]\]|`[^`]+`)')
  $plain = New-Object System.Text.StringBuilder
  $fmts = New-Object System.Collections.ArrayList
  foreach ($t in $tokens) {
    if ($t -eq '') { continue }
    $off = $plain.Length
    if ($t -match '^\*\*(.+)\*\*$') { [void]$plain.Append($Matches[1]); [void]$fmts.Add(@($off, $Matches[1].Length, 'b')) }
    elseif ($t -match '^\[\[(.+)\]\]$') { $s = '[' + $Matches[1] + ']'; [void]$plain.Append($s); [void]$fmts.Add(@($off, $s.Length, 'ph')) }
    elseif ($t -match '^`([^`]+)`$') { [void]$plain.Append($Matches[1]); [void]$fmts.Add(@($off, $Matches[1].Length, 'c')) }
    else { [void]$plain.Append($t) }
  }
  return @{ Plain = $plain.ToString(); Fmts = $fmts }
}
function Apply-Fmts($start, $fmts, $codeSize) {
  foreach ($f in $fmts) {
    $r = $doc.Range($start + $f[0], $start + $f[0] + $f[1])
    switch ($f[2]) {
      'b'  { $r.Font.Bold = 1 }
      'ph' { $r.Font.Bold = 1; $r.HighlightColorIndex = 7; $r.Font.Color = (RGBc 0 0 0) }
      'c'  { $r.Font.Name = 'Consolas'; if ($codeSize) { $r.Font.Size = $codeSize } else { $r.Font.Size = 9.5 } }
    }
  }
}
function End-Doc { $sel.EndKey(6) | Out-Null }
function TP {
  # new paragraph; clear highlight and character formatting so that it does not leak from the previous text
  $sel.TypeParagraph()
  $r = $doc.Paragraphs.Last.Range
  $r.HighlightColorIndex = 0
  $r.Font.Reset()
}
function Add-Para([string]$text, [string]$style) {
  End-Doc
  $sel.Style = $doc.Styles.Item($style)
  $rich = Parse-Rich $text
  $start = $sel.Start
  $sel.InsertAfter($rich.Plain); $sel.Collapse(0)
  Apply-Fmts $start $rich.Fmts $null
  TP
}
function Add-Heading([int]$level, [string]$text) { Add-Para $text ("Heading $level") }
function Add-Caption([string]$label, [string]$text, [bool]$keepNext) {
  End-Doc
  $sel.Style = $doc.Styles.Item('Caption')
  $sel.InsertAfter("$label "); $sel.Collapse(0)
  $doc.Fields.Add($sel.Range, -1, "SEQ $label \* ARABIC", $false) | Out-Null
  End-Doc
  $rich = Parse-Rich (". " + $text)
  $start = $sel.Start
  $sel.InsertAfter($rich.Plain); $sel.Collapse(0)
  Apply-Fmts $start $rich.Fmts $null
  $doc.Paragraphs.Last.KeepWithNext = [int]$(if ($keepNext) { -1 } else { 0 })
  if ($label -eq 'Figure') { $sel.ParagraphFormat.Alignment = 1 } else { $sel.ParagraphFormat.Alignment = 0 }
  TP
  $doc.Paragraphs.Last.Previous(1).Format.KeepWithNext = [int]$(if ($keepNext) { -1 } else { 0 })
  $sel.ParagraphFormat.Alignment = 0
}
function Add-List([object[]]$items, [bool]$numbered) {
  $i = 0
  foreach ($it in $items) {
    $i++
    End-Doc
    if ($numbered) {
      $sel.Style = $doc.Styles.Item(-1)
      $sel.ParagraphFormat.LeftIndent = 22; $sel.ParagraphFormat.FirstLineIndent = -18; $sel.ParagraphFormat.SpaceAfter = 3
      $rich = Parse-Rich ("$i.`t" + $it)
      $sel.ParagraphFormat.TabStops.ClearAll(); $sel.ParagraphFormat.TabStops.Add(22) | Out-Null
    } else {
      $sel.Style = $doc.Styles.Item(-49)
      $rich = Parse-Rich $it
    }
    $start = $sel.Start
    $sel.InsertAfter($rich.Plain); $sel.Collapse(0)
    Apply-Fmts $start $rich.Fmts $null
    TP
    if ($numbered) { $sel.ParagraphFormat.LeftIndent = 0; $sel.ParagraphFormat.FirstLineIndent = 0 }
  }
  End-Doc; $sel.Style = $doc.Styles.Item(-1)
}
function Add-Code([string]$code) {
  foreach ($line in ($code -split "`n")) {
    End-Doc
    $sel.Style = $doc.Styles.Item('CodeBlock')
    $sel.InsertAfter($line.TrimEnd("`r")); $sel.Collapse(0)
    TP
  }
  End-Doc; $sel.Style = $doc.Styles.Item(-1); $doc.Paragraphs.Last.Previous(1).SpaceAfter = 8
}
function Add-Table($b) {
  if ($b.caption) { Add-Caption 'Table' $b.caption $true }
  End-Doc
  $sel.Style = $doc.Styles.Item(-1)
  $header = @($b.header); $rows = @($b.rows)
  $cols = $header.Count
  $tbl = $doc.Tables.Add($sel.Range, $rows.Count + 1, $cols)
  $tbl.AllowAutoFit = $false
  $tbl.Range.Font.Size = 9.5
  $tbl.Range.ParagraphFormat.SpaceAfter = 2; $tbl.Range.ParagraphFormat.SpaceBefore = 2; $tbl.Range.ParagraphFormat.LineSpacingRule = 0
  $tbl.TopPadding = 2; $tbl.BottomPadding = 2; $tbl.LeftPadding = 4; $tbl.RightPadding = 4
  $tbl.Borders.Enable = $true; $tbl.Borders.InsideColor = $LINE; $tbl.Borders.OutsideColor = $LINE
  $w = @($b.widths); $sum = 0; foreach ($x in $w) { $sum += $x }
  $tbl.PreferredWidthType = 3; $tbl.PreferredWidth = $TEXTW
  for ($c = 1; $c -le $cols; $c++) { $col = $tbl.Columns.Item($c); $col.PreferredWidthType = 3; $col.PreferredWidth = [double]($TEXTW * $w[$c - 1] / $sum); $col.Width = [double]($TEXTW * $w[$c - 1] / $sum) }
  for ($c = 1; $c -le $cols; $c++) {
    $cell = $tbl.Cell(1, $c); $rich = Parse-Rich ([string]$header[$c - 1]); $cell.Range.Text = $rich.Plain
  }
  for ($r = 0; $r -lt $rows.Count; $r++) {
    $row = @($rows[$r])
    for ($c = 0; $c -lt $cols; $c++) {
      $val = ''; if ($c -lt $row.Count) { $val = [string]$row[$c] }
      $rich = Parse-Rich $val
      $cell = $tbl.Cell($r + 2, $c + 1)
      $cell.Range.Text = $rich.Plain
      if ($rich.Fmts.Count -gt 0) { Apply-Fmts $cell.Range.Start $rich.Fmts 8.5 }
    }
  }
  $hr = $tbl.Rows.Item(1)
  $hr.Shading.BackgroundPatternColor = $NAVY; $hr.Range.Font.Color = $WHITE; $hr.Range.Font.Bold = 1; $hr.HeadingFormat = -1
  for ($r = 3; $r -le $rows.Count + 1; $r += 2) { $tbl.Rows.Item($r).Shading.BackgroundPatternColor = $BAND }
  $tbl.Rows.AllowBreakAcrossPages = 0
  if ($b.keep) { $tbl.Range.ParagraphFormat.KeepWithNext = -1 }
  if ($b.firstColBold) { for ($r = 2; $r -le $rows.Count + 1; $r++) { $tbl.Cell($r, 1).Range.Font.Bold = 1 } }
  End-Doc
  $sel.Style = $doc.Styles.Item(-1)
  $sp = $doc.Paragraphs.Last; $sp.SpaceAfter = 6
  TP
}
function Add-Image($path, [double]$widthCm, [string]$alt) {
  $path = ([string]$path) -replace '/', [string][char]92
  if (-not (Test-Path -LiteralPath $path)) { throw "Image not found: $path" }
  End-Doc
  $sel.Style = $doc.Styles.Item(-1); $sel.ParagraphFormat.Alignment = 1; $sel.ParagraphFormat.KeepWithNext = -1; $sel.ParagraphFormat.SpaceAfter = 2
  $pic = $sel.InlineShapes.AddPicture($path, $false, $true)
  $pic.LockAspectRatio = -1; $pic.Width = [single]($widthCm * 28.3465)
  $pic.AlternativeText = $alt
  TP; $sel.ParagraphFormat.Alignment = 0; $sel.ParagraphFormat.KeepWithNext = 0
}
function Add-ImageRow($b) {
  End-Doc
  $sel.Style = $doc.Styles.Item(-1)
  $imgs = @($b.images)
  $tbl = $doc.Tables.Add($sel.Range, 1, $imgs.Count)
  $tbl.Borders.Enable = $false; $tbl.AllowAutoFit = $false
  $tbl.Range.ParagraphFormat.KeepWithNext = -1
  for ($i = 0; $i -lt $imgs.Count; $i++) {
    $cell = $tbl.Cell(1, $i + 1)
    $cell.Range.ParagraphFormat.Alignment = 1
    $cell.Width = $TEXTW / $imgs.Count
    $ipath = ([string]$imgs[$i].path) -replace '/', [string][char]92
    if (-not (Test-Path -LiteralPath $ipath)) { throw "Image not found: $ipath" }
    $pic = $cell.Range.InlineShapes.AddPicture($ipath, $false, $true)
    $pic.LockAspectRatio = -1; $pic.Width = [single]($imgs[$i].widthCm * 28.3465); $pic.AlternativeText = [string]$imgs[$i].alt
  }
  End-Doc
  $sel.Style = $doc.Styles.Item(-1)
  TP
  if ($b.caption) { Add-Caption 'Figure' $b.caption $false }
}

# ---------- cover ----------
function Add-Cover($b) {
  End-Doc
  $sel.Style = $doc.Styles.Item(-1)
  $sel.ParagraphFormat.SpaceBefore = 20
  $richI = Parse-Rich ([string]$b.institution)
  $startI = $sel.Start
  $sel.InsertAfter($richI.Plain); $sel.Collapse(0)
  Apply-Fmts $startI $richI.Fmts $null
  TP
  $doc.Paragraphs.Last.Previous(1).Range.Font.Size = 12
  $sel.ParagraphFormat.SpaceBefore = 50
  $sel.Font.Size = 40; $sel.Font.Bold = 1; $sel.Font.Color = $NAVY
  $sel.InsertAfter($b.title); $sel.Collapse(0); TP
  $sel.Font.Size = 20; $sel.Font.Bold = 0; $sel.Font.Color = $BLUE; $sel.ParagraphFormat.SpaceBefore = 6
  $sel.InsertAfter($b.subtitle); $sel.Collapse(0); TP
  $sel.Font.Size = 13; $sel.Font.Color = $GREY; $sel.ParagraphFormat.SpaceBefore = 24
  $sel.InsertAfter($b.course); $sel.Collapse(0); TP
  $sel.Font.Size = 11; $sel.Font.Color = (RGBc 0 0 0); $sel.ParagraphFormat.SpaceBefore = 0
  End-Doc
  $rows = @($b.details)
  $tbl = $doc.Tables.Add($sel.Range, $rows.Count, 2)
  $tbl.Borders.Enable = $false; $tbl.AllowAutoFit = $false
  $tbl.Columns.Item(1).Width = 140; $tbl.Columns.Item(2).Width = $TEXTW - 140
  $tbl.Range.Font.Size = 11; $tbl.Range.ParagraphFormat.SpaceAfter = 3; $tbl.Range.ParagraphFormat.SpaceBefore = 0; $tbl.Range.ParagraphFormat.LineSpacingRule = 0
  for ($r = 0; $r -lt $rows.Count; $r++) {
    $tbl.Cell($r + 1, 1).Range.Text = [string]$rows[$r][0]; $tbl.Cell($r + 1, 1).Range.Font.Bold = 1; $tbl.Cell($r + 1, 1).Range.Font.Color = $GREY
    $rich = Parse-Rich ([string]$rows[$r][1]); $tbl.Cell($r + 1, 2).Range.Text = $rich.Plain
    Apply-Fmts $tbl.Cell($r + 1, 2).Range.Start $rich.Fmts 10
  }
  $tbl.Borders.Item(-3).LineStyle = 1; $tbl.Borders.Item(-3).Color = $LINE   # bottom border of the block
  End-Doc
  $sel.Style = $doc.Styles.Item('Callout')
  $sel.ParagraphFormat.SpaceBefore = 24
  $rich = Parse-Rich $b.status
  $start = $sel.Start
  $sel.InsertAfter($rich.Plain); $sel.Collapse(0); Apply-Fmts $start $rich.Fmts $null
  TP
  End-Doc; $sel.Style = $doc.Styles.Item(-1)
}

function Add-Toc {
  End-Doc
  $sel.Style = $doc.Styles.Item('FrontHeading'); $sel.InsertAfter('Contents'); $sel.Collapse(0); TP
  $sel.Style = $doc.Styles.Item(-1)
  $doc.TablesOfContents.Add($sel.Range, $true, 1, 2) | Out-Null
  End-Doc; TP
  $sel.Style = $doc.Styles.Item('FrontHeading'); $sel.InsertAfter('List of figures'); $sel.Collapse(0); TP
  $doc.Paragraphs.Last.Previous(1).Format.PageBreakBefore = 0
  $sel.Style = $doc.Styles.Item(-1)
  $doc.TablesOfFigures.Add($sel.Range, 'Figure', $true) | Out-Null
  End-Doc; TP
  $sel.Style = $doc.Styles.Item('FrontHeading'); $sel.InsertAfter('List of tables'); $sel.Collapse(0); TP
  $doc.Paragraphs.Last.Previous(1).Format.PageBreakBefore = 0
  $sel.Style = $doc.Styles.Item(-1)
  $doc.TablesOfFigures.Add($sel.Range, 'Table', $true) | Out-Null
  End-Doc; TP
}

# ---------- build ----------
Set-Prop 'Title' $spec.properties.title
Set-Prop 'Subject' $spec.properties.subject
Set-Prop 'Author' $spec.properties.author
Set-Prop 'Comments' $spec.properties.comments
$blockNo = 0
foreach ($b in $spec.blocks) {
  $blockNo++
  switch ($b.type) {
    'cover'     { Add-Cover $b }
    'toc'       { Add-Toc }
    'front'     { End-Doc; $sel.Style = $doc.Styles.Item('FrontHeading'); $sel.InsertAfter($b.text); $sel.Collapse(0); TP; $sel.Style = $doc.Styles.Item(-1) }
    'h1'        { Add-Heading 1 $b.text; if ($b.tag) { Add-Para $b.tag 'ElementTag' } }
    'h2'        { Add-Heading 2 $b.text }
    'h3'        { Add-Heading 3 $b.text }
    'p'         { Add-Para $b.text 'Normal' }
    'bullets'   { Add-List @($b.items) $false }
    'numbered'  { Add-List @($b.items) $true }
    'code'      { Add-Code $b.text }
    'callout'   { Add-Para $b.text 'Callout' }
    'note'      { Add-Para $b.text 'NoteBox' }
    'table'     { Add-Table $b }
    'image'     { Add-Image $b.path $b.widthCm $b.alt; if ($b.caption) { Add-Caption 'Figure' $b.caption $false } }
    'imagerow'  { Add-ImageRow $b }
    'pagebreak' { End-Doc; $sel.InsertBreak(7) }
    default     { throw "Unknown block type: $($b.type) at block $blockNo" }
  }
}

# ---------- header / footer ----------
$sec = $doc.Sections.Item(1)
$sec.PageSetup.DifferentFirstPageHeaderFooter = -1
$hdr = $sec.Headers.Item(1).Range
$hdr.Text = $spec.properties.header
$hdr.Font.Size = 9; $hdr.Font.Color = $GREY; $hdr.ParagraphFormat.Alignment = 2
$ftr = $sec.Footers.Item(1).Range
$ftr.Text = $spec.properties.footer + "`tPage "
$ftr.Font.Size = 9; $ftr.Font.Color = $GREY
$ftr.ParagraphFormat.TabStops.ClearAll(); $ftr.ParagraphFormat.TabStops.Add($TEXTW, 2) | Out-Null
$fr = $sec.Footers.Item(1).Range; $fr.Collapse(0)
$doc.Fields.Add($fr, 33) | Out-Null

# ---------- update fields, save, export ----------
$doc.Repaginate()
foreach ($t in $doc.TablesOfContents) { $t.Update() }
foreach ($t in $doc.TablesOfFigures) { $t.Update() }
$doc.Fields.Update() | Out-Null
foreach ($t in $doc.TablesOfContents) { $t.Update() }
foreach ($t in $doc.TablesOfFigures) { $t.Update() }
$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)
$doc.SaveAs2($OutDocx, 16)
$doc.ExportAsFixedFormat($OutPdf, 17)
Write-Output "pages=$pages words=$words tables=$($doc.Tables.Count) figures=$($doc.InlineShapes.Count)"
$doc.Close(0); $doc = $null
} catch {
  Write-Output ('BUILD ERROR at block ' + $blockNo + ' (' + $b.type + '): ' + $_.Exception.Message)
  Write-Output $_.InvocationInfo.PositionMessage
  throw
} finally {
  if ($doc) { try { $doc.Close(0) } catch {} }
  try { $word.Quit() } catch {}
}
