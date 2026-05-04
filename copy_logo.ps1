$sourcePath = "c:\Users\cho\Desktop\진센조 프로젝트\이미지\진센조로고.png"
$destPath = "c:\Users\cho\Desktop\진센조 프로젝트\api\web\public\images\logo.png"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $destPath -Force
    Write-Host "Success: Logo copied successfully."
} else {
    Write-Host "Error: Source logo file not found at $sourcePath"
}
