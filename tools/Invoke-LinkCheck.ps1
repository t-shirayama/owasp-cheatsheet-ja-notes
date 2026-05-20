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
$linkPattern = [regex]'(?<!!)\[[^\]]+\]\((?<target>[^)]+)\)'

function Add-Issue {
    param(
        [string]$Path,
        [int]$Line,
        [string]$Message
    )

    $relativePath = Resolve-Path -LiteralPath $Path -Relative
    $issues.Add("${relativePath}:${Line} ${Message}")
}

foreach ($file in $markdownFiles) {
    $content = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes($file.FullName))
    $lines = $content -split "`r?`n"
    $inFence = $false
    for ($lineIndex = 0; $lineIndex -lt $lines.Count; $lineIndex++) {
        $line = $lines[$lineIndex]
        if ($line -match '^\s*```') {
            $inFence = -not $inFence
            continue
        }
        if ($inFence) {
            continue
        }
        $linkLine = [regex]::Replace($line, '`[^`]*`', '')
        foreach ($match in $linkPattern.Matches($linkLine)) {
            $target = $match.Groups["target"].Value.Trim()
            if ($target.Length -eq 0) {
                Add-Issue $file.FullName ($lineIndex + 1) "empty Markdown link target"
                continue
            }

            if ($target.StartsWith("<") -and $target.EndsWith(">")) {
                $target = $target.Substring(1, $target.Length - 2)
            }

            $withoutAnchor = $target.Split("#", 2)[0]
            if ($withoutAnchor.Length -eq 0) {
                continue
            }

            if ($withoutAnchor -match "^(https?|mailto):") {
                try {
                    $uri = [System.Uri]::new($withoutAnchor)
                    if ($withoutAnchor -match "^https?:" -and -not $uri.Host.Contains(".")) {
                        Add-Issue $file.FullName ($lineIndex + 1) "external URL host looks invalid: $withoutAnchor"
                    }
                }
                catch {
                    Add-Issue $file.FullName ($lineIndex + 1) "invalid external URL: $withoutAnchor"
                }
                continue
            }

            if ($withoutAnchor -match "^[a-zA-Z][a-zA-Z0-9+.-]*:") {
                Add-Issue $file.FullName ($lineIndex + 1) "unsupported link scheme: $withoutAnchor"
                continue
            }

            $decodedTarget = [System.Uri]::UnescapeDataString($withoutAnchor)
            $normalizedTarget = $decodedTarget -replace "/", [System.IO.Path]::DirectorySeparatorChar
            $candidate = Join-Path -Path $file.DirectoryName -ChildPath $normalizedTarget
            if (-not (Test-Path -LiteralPath $candidate)) {
                Add-Issue $file.FullName ($lineIndex + 1) "missing internal link target: $withoutAnchor"
            }
        }
    }
}

if ($issues.Count -gt 0) {
    $issues | Sort-Object | ForEach-Object { Write-Error $_ -ErrorAction Continue }
    exit 1
}

Write-Host "Link check passed for $($markdownFiles.Count) files."
