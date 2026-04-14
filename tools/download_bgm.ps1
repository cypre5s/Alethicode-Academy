$bgmDir = "public\assets\audio\bgm"
if (!(Test-Path $bgmDir)) { New-Item -ItemType Directory -Path $bgmDir -Force | Out-Null }

$tracks = @(
    @{ file="bgm_11_nostalgia.mp3";     src="piano37";      page="bgm_piano37";      desc="Nostalgia - Sepia Wind" }
    @{ file="bgm_12_gentle_rain.mp3";   src="piano40";      page="bgm_piano40";      desc="Gentle Rain - Peaceful Thoughts" }
    @{ file="bgm_13_determination.mp3"; src="piano36";      page="bgm_piano36";      desc="Determination - Fate Scenario" }
    @{ file="bgm_14_playful.mp3";       src="piano25";      page="bgm_piano25";      desc="Playful - Cookie Cookie" }
    @{ file="bgm_15_study.mp3";         src="piano38";      page="bgm_piano38";      desc="Study - Drifting Moment" }
    @{ file="bgm_16_confession.mp3";    src="piano34";      page="bgm_piano34";      desc="Confession - Silent World" }
    @{ file="bgm_17_comedy.mp3";        src="piano24";      page="bgm_piano24";      desc="Comedy - Light piano" }
    @{ file="bgm_18_heartache.mp3";     src="piano41";      page="bgm_piano41";      desc="Heartache - Last daily sound 2" }
    @{ file="bgm_19_victory.mp3";       src="piano05";      page="bgm_piano05";      desc="Victory - Forward piano" }
    @{ file="bgm_20_night_walk.mp3";    src="piano35";      page="bgm_piano35";      desc="Night Walk - Overlooking City" }
    @{ file="bgm_21_spring_breeze.mp3"; src="piano33";      page="bgm_piano33";      desc="Spring - Embracing Memories" }
    @{ file="bgm_22_summer_sun.mp3";    src="piano39";      page="bgm_piano39";      desc="Summer - Beyond Time Path" }
    @{ file="bgm_23_autumn_leaves.mp3"; src="acoustic14";   page="bgm_acoustic14";   desc="Autumn - Acoustic guitar+piano" }
    @{ file="bgm_24_winter_cold.mp3";   src="piano32";      page="bgm_piano32";      desc="Winter - Pulse piano" }
    @{ file="bgm_25_club_activity.mp3"; src="piano18";      page="bgm_piano18";      desc="Club Activity - Warm piano" }
    @{ file="bgm_26_warmth.mp3";        src="piano14";      page="bgm_piano14";      desc="Warmth - Relaxed piano" }
    @{ file="bgm_27_anxiety.mp3";       src="piano29";      page="bgm_piano29";      desc="Anxiety - Unsettling piano" }
    @{ file="bgm_28_hope.mp3";          src="piano10";      page="bgm_piano10";      desc="Hope - Uplifting piano" }
    @{ file="bgm_29_together.mp3";      src="piano26";      page="bgm_piano26";      desc="Together - Gentle ensemble" }
    @{ file="bgm_30_starry_night.mp3";  src="piano28";      page="bgm_piano28";      desc="Starry Night - Dreamy piano" }
    @{ file="bgm_31_daily_b.mp3";       src="piano23";      page="bgm_piano23";      desc="Daily B - Cheerful piano" }
    @{ file="bgm_32_peaceful_b.mp3";    src="piano20";      page="bgm_piano20";      desc="Peaceful B - Healing piano" }
)

$success = 0
$total = $tracks.Count

foreach ($t in $tracks) {
    $dest = Join-Path $bgmDir $t.file
    Write-Host "`n--- $($t.file) ---"
    Write-Host "  $($t.desc)"
    
    if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 50000) {
        $sizeKB = [math]::Round((Get-Item $dest).Length / 1024)
        Write-Host "  [SKIP] Already exists (${sizeKB}KB)"
        $success++
        continue
    }
    
    $dlUrl = "https://maou.audio/sound/bgm/maou_bgm_$($t.src).mp3"
    $referer = "https://maou.audio/$($t.page)/"
    $headers = @{
        "Referer" = $referer
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
    
    try {
        Write-Host "  Downloading..."
        Invoke-WebRequest -Uri $dlUrl -Headers $headers -OutFile $dest -UseBasicParsing -TimeoutSec 30
        if ((Test-Path $dest) -and (Get-Item $dest).Length -gt 50000) {
            $sizeKB = [math]::Round((Get-Item $dest).Length / 1024)
            Write-Host "  [OK] ${sizeKB}KB"
            $success++
        } else {
            Write-Host "  [FAIL] File too small"
            if (Test-Path $dest) { Remove-Item $dest -Force }
        }
    } catch {
        Write-Host "  [FAIL] $($_.Exception.Message)"
        if (Test-Path $dest) { Remove-Item $dest -Force }
    }
    
    Start-Sleep -Milliseconds 1500
}

Write-Host "`n=== Done: $success/$total BGM tracks downloaded ==="
