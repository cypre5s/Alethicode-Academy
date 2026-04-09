"""
Yuzusoft-style Background Post-processor

Applies Yuzusoft-style visual filters to existing background images:
- Day: warm tone + soft glow + light sepia
- Evening: orange-red gradient overlay + enhanced saturation
- Night: deep blue tone + star particles + reduced brightness
- All: soft focus bloom to mimic Yuzusoft's dreamy background feel

Usage: python tools/yuzusoft_style_backgrounds.py
Requires: pip install Pillow
"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BG_ROOT = PROJECT_ROOT / 'public' / 'assets' / 'backgrounds'

CANVAS_SIZE = (1600, 900)
SAVE_OPTIONS = {'format': 'WEBP', 'quality': 92, 'method': 6}


def apply_yuzusoft_day(img: Image.Image) -> Image.Image:
    """Warm, bright, slightly dreamy day scene."""
    img = ImageEnhance.Color(img).enhance(1.12)
    img = ImageEnhance.Brightness(img).enhance(1.05)

    warm = Image.new('RGBA', img.size, (255, 248, 230, 18))
    img = Image.alpha_composite(img.convert('RGBA'), warm)

    bloom = img.filter(ImageFilter.GaussianBlur(radius=12))
    bloom = ImageEnhance.Brightness(bloom).enhance(1.15)
    img = Image.blend(img, bloom, alpha=0.18)

    glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    cx, cy = int(img.width * 0.75), int(img.height * 0.15)
    for r in range(300, 0, -2):
        alpha = int(22 * (r / 300))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 245, 220, alpha))
    img = Image.alpha_composite(img, glow)

    return img.convert('RGB')


def apply_yuzusoft_evening(img: Image.Image) -> Image.Image:
    """Orange-gold sunset with enhanced warmth."""
    img = ImageEnhance.Color(img).enhance(1.25)
    img = ImageEnhance.Brightness(img).enhance(0.92)

    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(img.height):
        t = y / img.height
        r = int(255 * (1 - t * 0.3))
        g = int(160 + 60 * t)
        b = int(80 + 40 * t)
        a = int(35 * (1 - t))
        draw.line([(0, y), (img.width, y)], fill=(r, g, b, a))
    img = Image.alpha_composite(img.convert('RGBA'), overlay)

    bloom = img.filter(ImageFilter.GaussianBlur(radius=14))
    bloom = ImageEnhance.Brightness(bloom).enhance(1.08)
    img = Image.blend(img, bloom, alpha=0.22)

    return img.convert('RGB')


def apply_yuzusoft_night(img: Image.Image) -> Image.Image:
    """Deep blue night with star particles and subtle moonlight."""
    img = ImageEnhance.Brightness(img).enhance(0.55)
    img = ImageEnhance.Color(img).enhance(0.75)
    img = ImageEnhance.Contrast(img).enhance(1.12)

    blue_tint = Image.new('RGBA', img.size, (20, 30, 80, 40))
    img = Image.alpha_composite(img.convert('RGBA'), blue_tint)

    draw = ImageDraw.Draw(img)
    rng = random.Random(42)
    for _ in range(60):
        x = rng.randint(0, img.width)
        y = rng.randint(0, int(img.height * 0.5))
        size = rng.choice([1, 1, 2, 2, 3])
        alpha = rng.randint(120, 220)
        draw.ellipse([x, y, x + size, y + size], fill=(255, 255, 240, alpha))

    moon_x, moon_y = int(img.width * 0.8), int(img.height * 0.1)
    for r in range(80, 0, -1):
        alpha = int(8 * (r / 80))
        draw.ellipse([moon_x - r, moon_y - r, moon_x + r, moon_y + r],
                     fill=(200, 210, 255, alpha))

    bloom = img.filter(ImageFilter.GaussianBlur(radius=10))
    img = Image.blend(img, bloom, alpha=0.15)

    return img.convert('RGB')


VARIANT_PROCESSORS = {
    'day': apply_yuzusoft_day,
    'evening': apply_yuzusoft_evening,
    'night': apply_yuzusoft_night,
}


def process_scene(scene_dir: Path):
    """Process all variants of a single scene."""
    scene_name = scene_dir.name
    print(f'\nProcessing scene: {scene_name}')

    for variant_name, processor in VARIANT_PROCESSORS.items():
        src_path = scene_dir / f'{variant_name}.webp'
        if not src_path.exists():
            print(f'  [SKIP] {variant_name}.webp not found')
            continue

        img = Image.open(src_path)
        if img.size != CANVAS_SIZE:
            img = img.resize(CANVAS_SIZE, Image.LANCZOS)

        processed = processor(img)
        processed.save(src_path, **SAVE_OPTIONS)
        size_kb = src_path.stat().st_size / 1024
        print(f'  [OK] {variant_name}.webp -> Yuzusoft style ({size_kb:.0f} KB)')


def main():
    if not BG_ROOT.exists():
        print(f'Background directory not found: {BG_ROOT}')
        return

    scene_dirs = sorted([d for d in BG_ROOT.iterdir() if d.is_dir()])
    print(f'Found {len(scene_dirs)} scene directories')
    print('Applying Yuzusoft-style post-processing...')

    for scene_dir in scene_dirs:
        process_scene(scene_dir)

    print(f'\n=== Done: {len(scene_dirs)} scenes processed ===')


if __name__ == '__main__':
    main()
