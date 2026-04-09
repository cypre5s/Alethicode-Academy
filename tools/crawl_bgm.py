"""
BGM Crawler — DOVA-SYNDROME / 魔王魂
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

BGM_SPECS = [
    {
        'filename': 'bgm_01_title.mp3',
        'keywords': '学園 ピアノ 青春',
        'description': 'Title screen — piano + strings, youthful school feeling',
    },
    {
        'filename': 'bgm_02_daily.mp3',
        'keywords': '日常 明るい ほのぼの',
        'description': 'Daily life — cheerful guitar, warm atmosphere',
    },
    {
        'filename': 'bgm_03_peaceful.mp3',
        'keywords': '穏やか ピアノ 優しい',
        'description': 'Peaceful — gentle piano solo',
    },
    {
        'filename': 'bgm_05_tension.mp3',
        'keywords': '緊迫 バトル スピード',
        'description': 'Tension / competition — fast electronic beat',
    },
    {
        'filename': 'bgm_06_romantic.mp3',
        'keywords': '恋愛 切ない ピアノ',
        'description': 'Romantic — piano + strings quartet',
    },
    {
        'filename': 'bgm_07_sad.mp3',
        'keywords': '悲しい 切ない ピアノソロ',
        'description': 'Sad / farewell — slow piano solo',
    },
    {
        'filename': 'bgm_08_mystery.mp3',
        'keywords': 'ミステリー ダーク 不思議',
        'description': 'Mystery / Murasame theme — dark electronic',
    },
    {
        'filename': 'bgm_09_festival.mp3',
        'keywords': 'お祭り 楽しい にぎやか',
        'description': 'Festival — lively orchestral',
    },
    {
        'filename': 'bgm_10_ending.mp3',
        'keywords': '感動 壮大 エンディング',
        'description': 'Ending — grand orchestral + piano',
    },
    {
        'filename': 'battle.mp3',
        'keywords': 'テクノ 集中 プログラミング',
        'description': 'Coding challenge — electronic + rhythmic',
    },
    {
        'filename': 'morning_fresh.mp3',
        'keywords': '朝 さわやか 目覚め',
        'description': 'Morning scene — fresh and bright',
    },
    {
        'filename': 'evening_calm.mp3',
        'keywords': '夕方 穏やか 帰り道',
        'description': 'Evening scene — calm sunset walk',
    },
]


def search_dova(keywords: str, max_results: int = 5) -> list[dict]:
    """Search DOVA-SYNDROME for BGM matching keywords."""
    url = f'https://dova-s.jp/_contents/search/?search_word={quote(keywords)}'
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f'  [DOVA] Search failed: {e}')
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    results = []

    for item in soup.select('.searchResult a[href*="/bgm/"]')[:max_results]:
        href = item.get('href', '')
        if not href:
            continue
        detail_url = urljoin('https://dova-s.jp/', href)
        title = item.get_text(strip=True) or 'Unknown'
        results.append({'title': title, 'url': detail_url})

    return results


def get_dova_download_url(detail_url: str) -> str | None:
    """Get the MP3 download URL from a DOVA-SYNDROME detail page."""
    try:
        resp = requests.get(detail_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')
    dl_link = soup.select_one('a[href*="mp3"]')
    if dl_link:
        return urljoin(detail_url, dl_link['href'])

    for a in soup.find_all('a', href=True):
        href = a['href']
        if '.mp3' in href or 'download' in href.lower():
            return urljoin(detail_url, href)

    return None


def download_file(url: str, dest: Path) -> bool:
    """Download a file from URL to dest path."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=60, stream=True)
        resp.raise_for_status()
        content_type = resp.headers.get('Content-Type', '')
        if 'html' in content_type:
            print(f'  [SKIP] Got HTML instead of audio from {url}')
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, 'wb') as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)
        size_kb = dest.stat().st_size / 1024
        print(f'  [OK] Downloaded {dest.name} ({size_kb:.0f} KB)')
        return True
    except requests.RequestException as e:
        print(f'  [FAIL] Download failed: {e}')
        return False


def crawl_bgm_for_spec(spec: dict) -> bool:
    """Try to find and download a BGM matching the spec."""
    dest = BGM_DIR / spec['filename']
    print(f'\n--- {spec["filename"]} ---')
    print(f'  Description: {spec["description"]}')
    print(f'  Keywords: {spec["keywords"]}')

    if dest.exists() and dest.stat().st_size > 500_000:
        print(f'  [SKIP] Already exists with good size ({dest.stat().st_size / 1024:.0f} KB)')
        return True

    results = search_dova(spec['keywords'])
    if not results:
        print('  [WARN] No DOVA results found')
        return False

    for result in results:
        print(f'  Trying: {result["title"]} -> {result["url"]}')
        dl_url = get_dova_download_url(result['url'])
        if dl_url:
            if download_file(dl_url, dest):
                return True
        time.sleep(1)

    print(f'  [WARN] Could not download any matching BGM for {spec["filename"]}')
    return False


def main():
    BGM_DIR.mkdir(parents=True, exist_ok=True)
    print(f'BGM output directory: {BGM_DIR}')
    print(f'Crawling {len(BGM_SPECS)} BGM tracks from DOVA-SYNDROME...\n')

    success = 0
    for spec in BGM_SPECS:
        if crawl_bgm_for_spec(spec):
            success += 1
        time.sleep(2)

    print(f'\n=== Done: {success}/{len(BGM_SPECS)} BGM tracks downloaded ===')
    if success < len(BGM_SPECS):
        print('Some tracks could not be downloaded. You can manually download from:')
        print('  - https://dova-s.jp/')
        print('  - https://maou.audio/')
        print('  - https://amachamusic.chagasi.com/')


if __name__ == '__main__':
    main()
