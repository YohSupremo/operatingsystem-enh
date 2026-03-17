$replacements = [ordered]@{
    '<li><a href="group-policies.html">Part 8: Group Policies</a></li>' = '<li><a href="group-policies.html">Part 8: Group Policies</a></li><li><a href="windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
    '<li><a href="case-study/group-policies.html">Part 8: Group Policies</a></li>' = '<li><a href="case-study/group-policies.html">Part 8: Group Policies</a></li><li><a href="case-study/windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
    '<li><a href="../case-study/group-policies.html">Part 8: Group Policies</a></li>' = '<li><a href="../case-study/group-policies.html">Part 8: Group Policies</a></li><li><a href="../case-study/windows-deployment-services.html">Part 9: Windows Deployment Services</a></li>'
}

$count = 0
Get-ChildItem -Path "c:\fullstack\htdocs\operating_system_enh" -Filter *.html -Recurse | Where-Object { $_.Name -ne "windows-deployment-services.html" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $original = $content
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
        $count++
    }
}
Write-Output "Updated $count HTML files successfully."
