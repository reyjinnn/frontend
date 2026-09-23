$pattern = '<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> .*\r?\n?'
Get-ChildItem -Path "c:\Users\user\Documents\All Project\frontend-techvibe\src" -File -Recurse | ForEach-Object {
    $content = Get-Content -Raw -Path $_.FullName
    if ($content -match "<<<<<<< HEAD") {
        # Using a regex replace
        $newContent = [regex]::Replace($content, $pattern, '$1' + "`r`n")
        [IO.File]::WriteAllText($_.FullName, $newContent)
        Write-Host "Fixed $($_.FullName)"
    }
}
