"""
SE Crawler — 効果音ラボ / OtoLogic / Freesound
Downloads free-to-use sound effects matching galgame needs.

Usage: python tools/crawl_se.py
Requires: pip install requests beautifulsoup4
"""
from __future__ import annotations

import time
from pathlib import Path
from urllib.parse import quote, urljoin

import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SE_DIR = PROJECT_ROOT / 'public' / 'assets' / 'audio' / 'se'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'ja,en;q=0.9',
}

SE_SPECS = [
    {'filename': 'bell.mp3', 'category': 'school', 'keywords': '学校 チャイム', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'click.mp3', 'category': 'button', 'keywords': '決定 ボタン', 'page': 'https://soundeffect-lab.info/sound/button/'},
    {'filename': 'correct.mp3', 'category': 'anime', 'keywords': '正解', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'door.mp3', 'category': 'environment', 'keywords': 'ドア 開く', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'door_creak.mp3', 'category': 'environment', 'keywords': 'ドア きしむ', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'firework.mp3', 'category': 'environment', 'keywords': '花火', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'heartbeat.mp3', 'category': 'anime', 'keywords': '心臓 ドキドキ', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'keyboard_fast.mp3', 'category': 'environment', 'keywords': 'キーボード タイピング', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'level_up.mp3', 'category': 'anime', 'keywords': 'レベルアップ', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'page_turn.mp3', 'category': 'environment', 'keywords': 'ページ めくる', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'save.mp3', 'category': 'anime', 'keywords': 'セーブ チャイム', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'select.mp3', 'category': 'button', 'keywords': '選択 カーソル', 'page': 'https://soundeffect-lab.info/sound/button/'},
    {'filename': 'surprise.mp3', 'category': 'anime', 'keywords': '驚き', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'transition.mp3', 'category': 'anime', 'keywords': '場面転換', 'page': 'https://soundeffect-lab.info/sound/anime/'},
    {'filename': 'typing.mp3', 'category': 'environment', 'keywords': 'タイピング', 'page': 'https://soundeffect-lab.info/sound/various/'},
    {'filename': 'wind.mp3', 'category': 'nature', 'keywords': '風 穏やか', 'page': 'https://soundeffect-lab.info/sound/environment/'},
    {'filename': 'wrong.mp3', 'category': 'anime', 'keywords': '不正解 ブザー', 'page': 'https://soundeffect-lab.info/sound/anime/'},
]


def search_soundeffect_lab(page_url: str, keywords: str) -> list[str]:
    """Search 効果音ラボ for matching sound effect download URLs."""
    try:
        resp = requests.get(page_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f'  [SE-LAB] Page fetch failed: {e}')
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    results = []
    keyword_list = keywords.split()

    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        text = a_tag.get_text(strip=True)
        if '.mp3' in href and any(kw in text for kw in keyword_list):
            full_url = urljoin(page_url, href)
            results.append(full_url)

    return results[:3]


def download_file(url: str, dest: Path) -> bool:
    """Download a file from URL to dest path."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        resp.raise_for_status()
        content_type = resp.headers.get('Content-Type', '')
        if 'html' in content_type:
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


def crawl_se_for_spec(spec: dict) -> bool:
    """Try to find and download an SE matching the spec."""
    dest = SE_DIR / spec['filename']
    print(f'\n--- {spec["filename"]} ---')
    print(f'  Keywords: {spec["keywords"]}')

    if dest.exists() and dest.stat().st_size > 5000:
        print(f'  [SKIP] Already exists ({dest.stat().st_size / 1024:.0f} KB)')
        return True

    urls = search_soundeffect_lab(spec['page'], spec['keywords'])
    if not urls:
        print('  [WARN] No matching SE found on 効果音ラボ')
        return False

    for url in urls:
        print(f'  Trying: {url}')
        if download_file(url, dest):
            return True
        time.sleep(0.5)

    return False


def main():
    SE_DIR.mkdir(parents=True, exist_ok=True)
    print(f'SE output directory: {SE_DIR}')
    print(f'Crawling {len(SE_SPECS)} sound effects...\n')

    success = 0
    for spec in SE_SPECS:
        if crawl_se_for_spec(spec):
            success += 1
        time.sleep(1)

    print(f'\n=== Done: {success}/{len(SE_SPECS)} SE downloaded ===')
    if success < len(SE_SPECS):
        print('Remaining SE can be manually downloaded from:')
        print('  - https://soundeffect-lab.info/')
        print('  - https://otologic.jp/')
        print('  - https://freesound.org/ (CC0)')


if __name__ == '__main__':
    main()
