param(
    [string]$Root = "."
)

$ErrorActionPreference = "Stop"

$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$markdownFiles = Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter "*.md" |
    Where-Object {
        $_.FullName -notmatch "\\.git\\" -and
        $_.FullName -notmatch "\\node_modules\\" -and
        $_.FullName -notmatch "\\build\\" -and
        $_.FullName -notmatch "\\.docusaurus\\"
    }

$issues = New-Object System.Collections.Generic.List[string]

function Add-Issue {
    param(
        [string]$Path,
        [int]$Line,
        [string]$Message
    )

    $relativePath = Resolve-Path -LiteralPath $Path -Relative
    if ($Line -gt 0) {
        $issues.Add("${relativePath}:${Line} ${Message}")
    }
    else {
        $issues.Add("${relativePath}: ${Message}")
    }
}

foreach ($file in $markdownFiles) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)
    $lines = $content -split '\r?\n'
    if ($lines.Count -gt 0 -and $lines[-1] -eq "") {
        $logicalLines = $lines[0..($lines.Count - 2)]
    }
    else {
        $logicalLines = $lines
    }

    if ($bytes.Count -eq 0 -or $bytes[-1] -ne 0x0A) {
        Add-Issue $file.FullName 0 "missing trailing newline"
    }

    $contentStartIndex = 0
    $frontmatter = @()
    if ($logicalLines.Count -gt 0 -and $logicalLines[0] -eq "---") {
        for ($i = 1; $i -lt $logicalLines.Count; $i++) {
            if ($logicalLines[$i] -eq "---") {
                if ($i -gt 1) {
                    $frontmatter = $logicalLines[1..($i - 1)]
                }
                $contentStartIndex = $i + 1
                break
            }
        }
    }

    $firstNonEmptyIndex = -1
    for ($i = $contentStartIndex; $i -lt $logicalLines.Count; $i++) {
        if ($logicalLines[$i].Trim().Length -gt 0) {
            $firstNonEmptyIndex = $i
            break
        }
    }

    if ($firstNonEmptyIndex -eq -1) {
        Add-Issue $file.FullName 0 "empty Markdown file"
        continue
    }

    $hideTitle = $frontmatter | Where-Object { $_ -match "^hide_title:\s*true\s*$" }
    $startsWithHero = $logicalLines[$firstNonEmptyIndex] -match '^<div className="docHero"'
    if (-not ($logicalLines[$firstNonEmptyIndex] -match "^# ") -and -not ($hideTitle -and $startsWithHero)) {
        Add-Issue $file.FullName ($firstNonEmptyIndex + 1) "first non-empty line should be an H1 heading"
    }

    $previousHeadingLevel = 0
    for ($i = 0; $i -lt $logicalLines.Count; $i++) {
        $line = $logicalLines[$i]
        if ($line -match "^(#{1,6})\s+\S") {
            $level = $Matches[1].Length
            if ($previousHeadingLevel -gt 0 -and $level -gt ($previousHeadingLevel + 1)) {
                Add-Issue $file.FullName ($i + 1) "heading level jumps from H$previousHeadingLevel to H$level"
            }
            $previousHeadingLevel = $level
        }
    }

    for ($i = 0; $i -lt $logicalLines.Count; $i++) {
        $line = $logicalLines[$i]
        if ($line -match "^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$") {
            if ($i -eq 0 -or -not ($logicalLines[$i - 1] -match "^\|.*\|$")) {
                Add-Issue $file.FullName ($i + 1) "table separator should follow a table header row"
            }
            if ($i + 1 -ge $logicalLines.Count -or -not ($logicalLines[$i + 1] -match "^\|.*\|$")) {
                Add-Issue $file.FullName ($i + 1) "table separator should be followed by at least one table body row"
            }
        }
    }

    if ($file.FullName -match "\\docs\\(translations|summaries|checklists)\\v\d+\\") {
        $requiredFields = @(
            "## Attribution",
            "- Original:",
            "- Source:",
            "- Copyright:",
            "- License:",
            "- License URL:",
            "- Changes:",
            "- Retrieved:"
        )
        foreach ($field in $requiredFields) {
            if ($content -notmatch [regex]::Escape($field)) {
                Add-Issue $file.FullName 0 "missing Attribution field: $field"
            }
        }
    }
}

if ($issues.Count -gt 0) {
    $issues | Sort-Object | ForEach-Object { Write-Error $_ -ErrorAction Continue }
    exit 1
}

Write-Host "Markdown lint passed for $($markdownFiles.Count) files."
