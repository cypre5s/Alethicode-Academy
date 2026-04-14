"""
BGM Crawler — maou.audio / amachamusic / DOVA-SYNDROME
Downloads free-to-use BGM MP3s matching Yuzusoft galgame style.
All sources are CC0 or free for commercial use.

Usage: python tools/crawl_bgm.py
Requires: pip install requests beautifulsoup4
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from urllib.parse import quote, urljoin

import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BGM_DIR = PROJECT_ROOT / 'public' / 'assets' / 'audio' / 'bgm'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'ja,en;q=0.9',
}

# ── Curated track list: maou.audio direct URLs ──
# These are known free-to-use tracks from 魔王魂 (maou.audio)
# License: Free for commercial use, credit appreciated but not required
MAOU_TRACKS = {
    'bgm_11_nostalgia.mp3': {
        'page': 'https://maou.audio/bgm_piano37/',
        'desc': 'Nostalgia — セピアの風 (Sepia Wind), reminiscent piano',
    },
    'bgm_12_gentle_rain.mp3': {
        'page': 'https://maou.audio/bgm_piano40/',
        'desc': 'Gentle rain — 安らぎの思い (Peaceful Thoughts), soft piano',
    },
    'bgm_13_determination.mp3': {
        'page': 'https://maou.audio/bgm_piano36/',
        'desc': 'Determination — 宿命のシナリオ (Fate Scenario), resolute piano',
    },
    'bgm_14_playful.mp3': {
        'page': 'https://maou.audio/category/bgm/bgm-healing/',
        'search': 'healing01',
        'desc': 'Playful — ヒーリング, light and bouncy',
    },
    'bgm_15_study.mp3': {
        'page': 'https://maou.audio/bgm_piano38/',
        'desc': 'Study — うつろな一時 (Drifting Moment), quiet focus piano',
    },
    'bgm_16_confession.mp3': {
        'page': 'https://maou.audio/bgm_piano34/',
        'desc': 'Confession — 静寂の世界へ (To the Silent World), emotional piano',
    },
    'bgm_17_comedy.mp3': {
        'page': 'https://maou.audio/category/bgm/bgm-healing/',
        'search': 'healing02',
        'desc': 'Comedy — ヒーリング, light-hearted',
    },
    'bgm_18_heartache.mp3': {
        'page': 'https://maou.audio/bgm_piano41/',
        'desc': 'Heartache — Last daily sound 2, bittersweet piano',
    },
    'bgm_19_victory.mp3': {
        'page': 'https://maou.audio/bgm_piano32/',
        'desc': 'Victory — 脈動 (Pulse), energetic piano',
    },
    'bgm_20_night_walk.mp3': {
        'page': 'https://maou.audio/bgm_piano35/',
        'desc': 'Night walk — 見渡す街へ (Overlooking the City), calm piano',
    },
    'bgm_21_spring_breeze.mp3': {
        'page': 'https://maou.audio/bgm_piano33/',
        'desc': 'Spring — 記憶を抱いて (Embracing Memories), gentle piano',
    },
    'bgm_22_summer_sun.mp3': {
        'page': 'https://maou.audio/bgm_piano39/',
        'desc': 'Summer — 時の道を越えて (Beyond the Path of Time), bright piano',
    },
}

# ── amachamusic curated tracks ──
AMACHA_BASE = 'https://amachamusic.chagasi.com'
AMACHA_TRACKS = {
    'bgm_23_autumn_leaves.mp3': {
        'search_tag': 'しっとり',
        'desc': 'Autumn leaves — melancholy acoustic',
    },
    'bgm_24_winter_cold.mp3': {
        'search_tag': '冬',
        'desc': 'Winter cold — sparse piano',
    },
    'bgm_25_club_activity.mp3': {
        'search_tag': '元気',
        'desc': 'Club activity — upbeat',
    },
    'bgm_26_warmth.mp3': {
        'search_tag': 'ほのぼの',
        'desc': 'Warmth — cozy gentle',
    },
    'bgm_27_anxiety.mp3': {
        'search_tag': '不安',
        'desc': 'Anxiety — tense dark',
    },
    'bgm_28_hope.mp3': {
        'search_tag': '希望',
        'desc': 'Hope — rising bright',
    },
    'bgm_29_together.mp3': {
        'search_tag': '友情',
        'desc': 'Together — warm friendship',
    },
    'bgm_30_starry_night.mp3': {
        'search_tag': '幻想',
        'desc': 'Starry night — ethereal dreamy',
    },
    'bgm_31_daily_b.mp3': {
        'search_tag': '日常',
        'desc': 'Daily life B — cheerful school life',
    },
    'bgm_32_peaceful_b.mp3': {
        'search_tag': '癒し',
        'desc': 'Peaceful B — healing ambient',
    },
}


def download_file(url: str, dest: Path) -> bool:
    """Download a file from URL to dest path."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=60, stream=True)
        resp.raise_for_status()
        content_type = resp.headers.get('Content-Type', '')
        if 'html' in content_type and 'audio' not in content_type:
            print(f'  [SKIP] Got HTML instead of audio from {url}')
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, 'wb') as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)
        size_kb = dest.stat().st_size / 1024
        if size_kb < 50:
            print(f'  [SKIP] File too small ({size_kb:.0f} KB), likely not audio')
            dest.unlink(missing_ok=True)
            return False
        print(f'  [OK] Downloaded {dest.name} ({size_kb:.0f} KB)')
        return True
    except requests.RequestException as e:
        print(f'  [FAIL] Download failed: {e}')
        return False


def extract_maou_mp3_url(page_url: str) -> str | None:
    """Extract the MP3 download URL from a maou.audio page."""
    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f'  [WARN] Could not fetch maou page: {e}')
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.endswith('.mp3'):
            return urljoin(page_url, href)

    for source in soup.find_all('source', src=True):
        src = source['src']
        if '.mp3' in src:
            return urljoin(page_url, src)

    for a in soup.find_all('a', href=True):
        href = a['href']
        if 'download' in href.lower() and ('mp3' in href.lower() or 'audio' in href.lower()):
            return urljoin(page_url, href)

    return None


def crawl_maou_tracks() -> int:
    """Download tracks from maou.audio."""
    success = 0
    for filename, info in MAOU_TRACKS.items():
        dest = BGM_DIR / filename
        print(f'\n--- {filename} ---')
        print(f'  {info["desc"]}')

        if dest.exists() and dest.stat().st_size > 50_000:
            print(f'  [SKIP] Already exists ({dest.stat().st_size / 1024:.0f} KB)')
            success += 1
            continue

        mp3_url = extract_maou_mp3_url(info['page'])
        if mp3_url:
            print(f'  Found MP3: {mp3_url}')
            if download_file(mp3_url, dest):
                success += 1
                time.sleep(2)
                continue

        print(f'  [WARN] Could not find download URL for {filename}')
        time.sleep(1)

    return success


def search_amacha(tag: str) -> list[str]:
    """Search amachamusic for download URLs matching a tag."""
    url = f'{AMACHA_BASE}/image_{quote(tag)}.html'
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    urls = []

    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.endswith('.mp3'):
            urls.append(urljoin(url, href))
        elif 'download' in href.lower() and 'mp3' in href.lower():
            urls.append(urljoin(url, href))

    return urls[:5]


def crawl_amacha_tracks() -> int:
    """Download tracks from amachamusic."""
    success = 0
    for filename, info in AMACHA_TRACKS.items():
        dest = BGM_DIR / filename
        print(f'\n--- {filename} ---')
        print(f'  {info["desc"]}')

        if dest.exists() and dest.stat().st_size > 50_000:
            print(f'  [SKIP] Already exists ({dest.stat().st_size / 1024:.0f} KB)')
            success += 1
            continue

        urls = search_amacha(info['search_tag'])
        if not urls:
            print(f'  [WARN] No results for tag: {info["search_tag"]}')
            time.sleep(1)
            continue

        for dl_url in urls:
            print(f'  Trying: {dl_url}')
            if download_file(dl_url, dest):
                success += 1
                break
            time.sleep(1)
        else:
            print(f'  [WARN] Could not download for {filename}')

        time.sleep(2)

    return success


def check_existing() -> int:
    """Count how many target files already exist."""
    all_files = set(MAOU_TRACKS.keys()) | set(AMACHA_TRACKS.keys())
    existing = 0
    for f in all_files:
        path = BGM_DIR / f
        if path.exists() and path.stat().st_size > 50_000:
            existing += 1
    return existing


def main():
    BGM_DIR.mkdir(parents=True, exist_ok=True)
    total = len(MAOU_TRACKS) + len(AMACHA_TRACKS)
    already = check_existing()
    print(f'BGM output directory: {BGM_DIR}')
    print(f'Target: {total} new BGM tracks ({already} already exist)')

    print(f'\n=== Phase 1: maou.audio ({len(MAOU_TRACKS)} tracks) ===')
    s1 = crawl_maou_tracks()

    print(f'\n=== Phase 2: amachamusic ({len(AMACHA_TRACKS)} tracks) ===')
    s2 = crawl_amacha_tracks()

    total_success = s1 + s2
    print(f'\n=== Done: {total_success}/{total} BGM tracks ready ===')

    missing = []
    for f in sorted(set(MAOU_TRACKS.keys()) | set(AMACHA_TRACKS.keys())):
        path = BGM_DIR / f
        if not path.exists() or path.stat().st_size < 50_000:
            missing.append(f)

    if missing:
        print(f'\nMissing {len(missing)} tracks:')
        for f in missing:
            print(f'  - {f}')
        print('\nYou can manually download from:')
        print('  - https://maou.audio/')
        print('  - https://amachamusic.chagasi.com/')
        print('  - https://dova-s.jp/')


if __name__ == '__main__':
    main()
