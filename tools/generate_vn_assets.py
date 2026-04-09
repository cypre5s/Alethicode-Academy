from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageEnhance, ImageFilter


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = PROJECT_ROOT.parent
SOURCE_ROOT = WORKSPACE_ROOT / 'tmp_assets' / 'background_sources'
PUBLIC_ROOT = PROJECT_ROOT / 'public' / 'assets'
BACKGROUND_ROOT = PUBLIC_ROOT / 'backgrounds'
CG_ROOT = PUBLIC_ROOT / 'cg'
UI_ROOT = PUBLIC_ROOT / 'ui'
CHARACTER_ROOT = PUBLIC_ROOT / 'characters'

CANVAS_SIZE = (1600, 900)
SAVE_OPTIONS = {"format": "WEBP", "quality": 90, "method": 6}


def school(file_name: str) -> Path:
    return SOURCE_ROOT / 'SchoolMiniPack_1080p_WEBP' / 'SchoolMiniPack_1080p_WEBP' / file_name


def room(file_name: str) -> Path:
    return SOURCE_ROOT / 'PersonalRooms1_1080p_WEBP' / 'PersonalRooms1_1080p_WEBP' / file_name


def academia(file_name: str) -> Path:
    return SOURCE_ROOT / 'Academia' / 'Academia' / file_name


BACKGROUND_SPECS = {
    'school_gate': {
        'day': {'source': school('smp_front_day3c.webp'), 'preset': 'spring_day', 'effects': ['petals']},
        'evening': {'source': school('smp_front_evening2c.webp'), 'preset': 'golden_hour', 'effects': ['petals']},
        'night': {'source': school('smp_front_night1c.webp'), 'preset': 'blue_night', 'effects': ['campus_lights']},
    },
    'hallway': {
        'day': {'source': school('smp_hallway33_day2.webp'), 'preset': 'spring_day', 'effects': ['dust']},
        'evening': {'source': school('smp_hallway33_evening1.webp'), 'preset': 'golden_hour', 'effects': ['dust']},
        'night': {'source': school('smp_hallway33_night1.webp'), 'preset': 'blue_night', 'effects': ['dust']},
    },
    'classroom': {
        'day': {'source': school('smp_classroom4_day2.webp'), 'preset': 'spring_day', 'effects': ['window_glow']},
        'evening': {'source': school('smp_classroom4_evening2.webp'), 'preset': 'golden_hour', 'effects': ['window_glow']},
        'night': {'source': school('smp_classroom4_night1.webp'), 'preset': 'blue_night', 'effects': ['window_glow']},
    },
    'computer_room': {
        'day': {'source': academia('computerclass.jpg'), 'preset': 'spring_day', 'effects': ['monitor_glow']},
        'evening': {'source': academia('computerclasseve.jpg'), 'preset': 'golden_hour', 'effects': ['monitor_glow']},
        'night': {'source': academia('computerclassnight.jpg'), 'preset': 'lab_night_glow', 'effects': ['monitor_glow']},
    },
    'library': {
        'day': {'source': academia('librarybooks.jpg'), 'preset': 'spring_day', 'effects': ['dust']},
        'evening': {'source': academia('librarybookseve.jpg'), 'preset': 'golden_hour', 'effects': ['dust']},
        'night': {'source': academia('librarybooksnight.jpg'), 'preset': 'blue_night', 'effects': ['dust']},
    },
    'rooftop': {
        'day': {'source': school('smp_roof_day2.webp'), 'preset': 'spring_day', 'effects': ['wind']},
        'evening': {'source': school('smp_roof_evening2.webp'), 'preset': 'golden_hour', 'effects': ['wind']},
        'night': {'source': school('smp_roof_night1.webp'), 'preset': 'fireworks_bloom', 'effects': ['stars']},
    },
    'cafeteria': {
        'day': {'source': academia('cafeteria.jpg'), 'preset': 'spring_day', 'effects': ['steam']},
        'evening': {'source': academia('cafeteriaeve.jpg'), 'preset': 'golden_hour', 'effects': ['steam']},
        'night': {'source': academia('cafeterianight.jpg'), 'preset': 'blue_night', 'effects': ['campus_lights']},
    },
    'school_yard': {
        'day': {'source': academia('cherrycampus.jpg'), 'preset': 'spring_day', 'effects': ['petals']},
        'evening': {'source': academia('cherrycampuseve.jpg'), 'preset': 'golden_hour', 'effects': ['petals']},
        'night': {'source': academia('cherrycampusnight.jpg'), 'preset': 'blue_night', 'effects': ['stars']},
    },
    'festival': {
        'day': {'source': academia('college2courtyard.jpg'), 'preset': 'spring_day', 'effects': ['festival_flags']},
        'evening': {'source': academia('college2courtyardeve.jpg'), 'preset': 'festival_lantern', 'effects': ['festival_flags', 'lanterns']},
        'night': {'source': academia('college2courtyardnight.jpg'), 'preset': 'festival_lantern', 'effects': ['lanterns', 'campus_lights']},
    },
    'player_room': {
        'day': {'source': room('prb_a1_day2.webp'), 'preset': 'spring_day', 'effects': ['desk_bloom']},
        'evening': {'source': room('prb_a1_evening2.webp'), 'preset': 'golden_hour', 'effects': ['desk_bloom']},
        'night': {'source': room('prb_a1_night1_lights.webp'), 'preset': 'blue_night', 'effects': ['desk_bloom', 'stars']},
    },
}

CG_SPECS = {
    'prologue_school_gate': {
        'background': ('school_gate', 'day'),
        'characters': [
            {'id': 'nene', 'expression': 'smile', 'x': 0.75, 'scale': 0.94, 'glow': '#f6bfd4'},
        ],
        'effects': ['petals', 'warm_bloom'],
        'overlay': '#fff8ef22',
    },
    'ch1_nene_teaching': {
        'background': ('computer_room', 'day'),
        'characters': [
            {'id': 'nene', 'expression': 'gentle_smile', 'x': 0.67, 'scale': 0.94, 'glow': '#f6bfd4'},
            {'id': 'yoshino', 'expression': 'glasses_adjust', 'x': 0.22, 'scale': 0.82, 'alpha': 0.82},
        ],
        'effects': ['code_panel', 'monitor_glow'],
        'overlay': '#ffffff12',
    },
    'ch1_night_shadow': {
        'background': ('computer_room', 'night'),
        'characters': [
            {'id': 'murasame', 'expression': 'cold', 'x': 0.72, 'scale': 0.98, 'glow': '#c98a71'},
        ],
        'effects': ['code_panel', 'night_bloom'],
        'overlay': '#140e2035',
    },
    'ch2_competition': {
        'background': ('computer_room', 'evening'),
        'characters': [
            {'id': 'ayase', 'expression': 'fired_up', 'x': 0.28, 'scale': 0.92, 'glow': '#ffbc7d'},
            {'id': 'yoshino', 'expression': 'glasses_adjust', 'x': 0.74, 'scale': 0.9, 'glow': '#bec9ff'},
        ],
        'effects': ['score_board', 'monitor_glow'],
        'overlay': '#fffbf520',
    },
    'ch2_kanna_fractal': {
        'background': ('library', 'night'),
        'characters': [
            {'id': 'kanna', 'expression': 'contemplative', 'x': 0.67, 'scale': 0.94, 'glow': '#b8d8ff'},
        ],
        'effects': ['fractal', 'night_bloom'],
        'overlay': '#0a11282a',
    },
    'ch3_festival': {
        'background': ('festival', 'evening'),
        'characters': [
            {'id': 'ayase', 'expression': 'grin', 'x': 0.27, 'scale': 0.9, 'glow': '#ffbf87'},
            {'id': 'nene', 'expression': 'smile', 'x': 0.73, 'scale': 0.88, 'glow': '#f5bfd4'},
        ],
        'effects': ['lanterns', 'festival_flags', 'warm_bloom'],
        'overlay': '#fff4e420',
    },
    'ch3_firework': {
        'background': ('rooftop', 'night'),
        'characters': [
            {'id': 'yoshino', 'expression': 'rare_gentle', 'x': 0.33, 'scale': 0.88, 'glow': '#c6cbff'},
            {'id': 'ayase', 'expression': 'soft_smile', 'x': 0.72, 'scale': 0.86, 'glow': '#ffbc87'},
        ],
        'effects': ['fireworks', 'night_bloom'],
        'overlay': '#0a0d2928',
    },
    'nene_heart_module': {
        'background': ('computer_room', 'night'),
        'characters': [
            {'id': 'nene', 'expression': 'blush', 'x': 0.69, 'scale': 0.96, 'glow': '#f8b9d6'},
        ],
        'effects': ['hearts', 'code_panel'],
        'overlay': '#25142d22',
    },
    'nene_good_end': {
        'background': ('school_gate', 'evening'),
        'characters': [
            {'id': 'nene', 'expression': 'gentle_smile', 'x': 0.67, 'scale': 0.98, 'glow': '#f5c0d8'},
        ],
        'effects': ['petals', 'warm_bloom'],
        'overlay': '#fff2ee1f',
    },
    'yoshino_imperfect_code': {
        'background': ('classroom', 'evening'),
        'characters': [
            {'id': 'yoshino', 'expression': 'blush', 'x': 0.69, 'scale': 0.93, 'glow': '#cfd2ff'},
        ],
        'effects': ['code_panel', 'paper_sheets'],
        'overlay': '#fff4ee1a',
    },
    'yoshino_good_end': {
        'background': ('library', 'evening'),
        'characters': [
            {'id': 'yoshino', 'expression': 'rare_gentle', 'x': 0.66, 'scale': 0.95, 'glow': '#cad2ff'},
        ],
        'effects': ['dust', 'warm_bloom'],
        'overlay': '#fff9ef15',
    },
    'ayase_final_match': {
        'background': ('computer_room', 'day'),
        'characters': [
            {'id': 'ayase', 'expression': 'competitive', 'x': 0.67, 'scale': 0.94, 'glow': '#ffb36d'},
        ],
        'effects': ['score_board', 'monitor_glow'],
        'overlay': '#fff8f118',
    },
    'ayase_good_end': {
        'background': ('school_yard', 'evening'),
        'characters': [
            {'id': 'ayase', 'expression': 'soft_smile', 'x': 0.68, 'scale': 0.94, 'glow': '#ffba7a'},
        ],
        'effects': ['petals', 'warm_bloom'],
        'overlay': '#fff0e41a',
    },
    'kanna_starry_program': {
        'background': ('library', 'night'),
        'characters': [
            {'id': 'kanna', 'expression': 'warm_smile', 'x': 0.68, 'scale': 0.94, 'glow': '#b5d4ff'},
        ],
        'effects': ['fractal', 'stars', 'night_bloom'],
        'overlay': '#0814262a',
    },
    'kanna_good_end': {
        'background': ('school_yard', 'night'),
        'characters': [
            {'id': 'kanna', 'expression': 'blush', 'x': 0.68, 'scale': 0.93, 'glow': '#c0ddff'},
        ],
        'effects': ['stars', 'night_bloom'],
        'overlay': '#10192b2e',
    },
    'murasame_championship': {
        'background': ('computer_room', 'night'),
        'characters': [
            {'id': 'murasame', 'expression': 'fierce', 'x': 0.69, 'scale': 0.98, 'glow': '#f0ab6f'},
        ],
        'effects': ['score_board', 'gold_sparks', 'monitor_glow'],
        'overlay': '#1a121220',
    },
    'murasame_good_end': {
        'background': ('rooftop', 'night'),
        'characters': [
            {'id': 'murasame', 'expression': 'genuine_smile', 'x': 0.69, 'scale': 0.95, 'glow': '#f1b37b'},
        ],
        'effects': ['fireworks', 'night_bloom'],
        'overlay': '#10142828',
    },
    'murasame_true_end': {
        'background': ('rooftop', 'night'),
        'characters': [
            {'id': 'murasame', 'expression': 'vulnerable', 'x': 0.66, 'scale': 0.98, 'glow': '#f5bc85'},
        ],
        'effects': ['fireworks', 'code_panel', 'gold_sparks', 'night_bloom'],
        'overlay': '#12142f2a',
    },
}


def ensure_dirs() -> None:
    BACKGROUND_ROOT.mkdir(parents=True, exist_ok=True)
    CG_ROOT.mkdir(parents=True, exist_ok=True)
    UI_ROOT.mkdir(parents=True, exist_ok=True)


def seed_for(name: str) -> random.Random:
    return random.Random(sum(ord(ch) for ch in name) * 97)


def load_image(path: Path) -> Image.Image:
    image = Image.open(path).convert('RGBA')
    return cover(image, CANVAS_SIZE)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = image.size
    target_width, target_height = size
    ratio = max(target_width / width, target_height / height)
    resized = image.resize((round(width * ratio), round(height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - target_width) // 2
    top = (resized.height - target_height) // 2
    return resized.crop((left, top, left + target_width, top + target_height))


def enhance(image: Image.Image, brightness: float, contrast: float, saturation: float) -> Image.Image:
    image = ImageEnhance.Brightness(image).enhance(brightness)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Color(image).enhance(saturation)
    return image


def tint(image: Image.Image, color: str, opacity: float) -> Image.Image:
    alpha = round(255 * opacity)
    overlay = Image.new('RGBA', image.size, ImageColor.getrgb(color) + (alpha,))
    return Image.alpha_composite(image, overlay)


def radial_glow(size: tuple[int, int], center: tuple[float, float], radius: float, color: str, opacity: float) -> Image.Image:
    width, height = size
    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    cx, cy = center
    rgba = ImageColor.getrgb(color)
    for step in range(8, 0, -1):
        ratio = step / 8
        alpha = round(255 * opacity * ratio * 0.2)
        current_radius = radius * ratio
        bounds = [cx - current_radius, cy - current_radius, cx + current_radius, cy + current_radius]
        draw.ellipse(bounds, fill=rgba + (alpha,))
    return overlay.filter(ImageFilter.GaussianBlur(radius * 0.14))


def add_vignette(image: Image.Image, strength: float = 0.18) -> Image.Image:
    width, height = image.size
    vignette = Image.new('L', image.size, 255)
    draw = ImageDraw.Draw(vignette)
    draw.rectangle((0, 0, width, height), fill=255)
    margin = round(min(width, height) * 0.08)
    draw.rounded_rectangle((margin, margin, width - margin, height - margin), radius=120, fill=200)
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new('RGBA', image.size, (30, 22, 18, round(255 * strength)))
    dark.putalpha(ImageChops.invert(vignette))
    return Image.alpha_composite(image, dark)


def add_bloom(image: Image.Image, radius: float, opacity: float) -> Image.Image:
    blur = image.filter(ImageFilter.GaussianBlur(radius))
    return Image.blend(image, blur, opacity)


def grade_background(image: Image.Image, preset: str) -> Image.Image:
    if preset == 'spring_day':
        image = enhance(image, 1.04, 1.04, 1.08)
        image = tint(image, '#fff6f0', 0.07)
        image = Image.alpha_composite(image, radial_glow(image.size, (320, 180), 360, '#ffdcbf', 0.36))
    elif preset == 'golden_hour':
        image = enhance(image, 1.0, 1.08, 1.1)
        image = tint(image, '#ffcc9a', 0.12)
        image = Image.alpha_composite(image, radial_glow(image.size, (1220, 190), 420, '#ffc272', 0.48))
    elif preset == 'blue_night':
        image = enhance(image, 0.93, 1.08, 0.92)
        image = tint(image, '#193765', 0.16)
        image = Image.alpha_composite(image, radial_glow(image.size, (1280, 190), 320, '#f3d0a3', 0.18))
    elif preset == 'lab_night_glow':
        image = enhance(image, 0.95, 1.1, 0.94)
        image = tint(image, '#132e52', 0.18)
        image = Image.alpha_composite(image, radial_glow(image.size, (820, 360), 420, '#89d6ff', 0.16))
    elif preset == 'festival_lantern':
        image = enhance(image, 1.02, 1.08, 1.1)
        image = tint(image, '#ffbc82', 0.16)
        image = Image.alpha_composite(image, radial_glow(image.size, (980, 160), 420, '#ffc469', 0.3))
    elif preset == 'fireworks_bloom':
        image = enhance(image, 0.96, 1.1, 1.02)
        image = tint(image, '#142b55', 0.12)
    return add_vignette(add_bloom(image, 12, 0.08), 0.14)


def line(draw: ImageDraw.ImageDraw, points: list[tuple[float, float]], fill: tuple[int, int, int, int], width: int) -> None:
    for index in range(len(points) - 1):
        draw.line((*points[index], *points[index + 1]), fill=fill, width=width)


def add_particles(image: Image.Image, effect: str, seed_name: str) -> Image.Image:
    rng = seed_for(seed_name + effect)
    overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    width, height = image.size

    if effect == 'petals':
        for _ in range(26):
            x = rng.randint(0, width)
            y = rng.randint(40, height - 60)
            w = rng.randint(18, 34)
            h = rng.randint(10, 18)
            color = rng.choice(['#ffd5df', '#ffc2d5', '#ffe2ec'])
            alpha = rng.randint(88, 156)
            draw.ellipse((x, y, x + w, y + h), fill=ImageColor.getrgb(color) + (alpha,))
            draw.ellipse((x + w * 0.3, y - h * 0.35, x + w * 0.75, y + h * 0.35), fill=ImageColor.getrgb(color) + (alpha,))
    elif effect == 'stars':
        for _ in range(42):
            x = rng.randint(0, width)
            y = rng.randint(0, round(height * 0.55))
            radius = rng.randint(2, 5)
            color = rng.choice(['#ffffff', '#e7f4ff', '#fff4d7'])
            alpha = rng.randint(90, 190)
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=ImageColor.getrgb(color) + (alpha,))
    elif effect == 'dust':
        for _ in range(75):
            x = rng.randint(0, width)
            y = rng.randint(40, height - 40)
            radius = rng.randint(2, 8)
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(255, 244, 230, rng.randint(15, 40)))
    elif effect == 'monitor_glow':
        for center_x, center_y, radius, color, opacity in [(450, 360, 220, '#7fdcff', 0.18), (1140, 320, 260, '#a7d8ff', 0.14)]:
            overlay = Image.alpha_composite(overlay, radial_glow(image.size, (center_x, center_y), radius, color, opacity))
    elif effect == 'window_glow':
        overlay = Image.alpha_composite(overlay, radial_glow(image.size, (1330, 260), 380, '#ffe1b2', 0.22))
    elif effect == 'campus_lights':
        for _ in range(12):
            x = rng.randint(80, width - 80)
            y = rng.randint(120, 420)
            overlay = Image.alpha_composite(overlay, radial_glow(image.size, (x, y), rng.randint(60, 110), '#ffd0a0', 0.12))
    elif effect == 'lanterns':
        for index in range(6):
            x = 180 + index * 220 + rng.randint(-24, 24)
            y = 110 + rng.randint(-10, 10)
            draw.line((x, 0, x, y - 24), fill=(120, 72, 42, 190), width=3)
            draw.rounded_rectangle((x - 26, y - 24, x + 26, y + 32), radius=12, fill=(255, 187, 105, 215), outline=(186, 94, 48, 240), width=2)
            overlay = Image.alpha_composite(overlay, radial_glow(image.size, (x, y + 6), 90, '#ffcf89', 0.18))
    elif effect == 'festival_flags':
        for row in range(2):
            start_y = 96 + row * 56
            line(draw, [(80, start_y), (420, start_y + 16), (780, start_y), (1180, start_y + 10), (1520, start_y - 12)], (187, 110, 78, 220), 3)
            for idx in range(14):
                base_x = 110 + idx * 100
                colors = ['#ff9d71', '#ffd56d', '#f7b5ce', '#8bc4ff', '#f4c7a3']
                top = start_y + (idx % 2) * 7
                draw.polygon(
                    [(base_x, top), (base_x + 30, top + 8), (base_x + 12, top + 34)],
                    fill=ImageColor.getrgb(colors[idx % len(colors)]) + (220,),
                )
    elif effect == 'steam':
        for offset in [220, 530, 980]:
            overlay = Image.alpha_composite(overlay, radial_glow(image.size, (offset, 290), 110, '#fff4ea', 0.12))
    elif effect == 'wind':
        for _ in range(8):
            start_x = rng.randint(-160, width - 200)
            start_y = rng.randint(160, 500)
            points = [(start_x, start_y)]
            for step in range(1, 6):
                points.append((start_x + step * rng.randint(50, 90), start_y + rng.randint(-36, 36)))
            line(draw, points, (255, 255, 255, 42), 3)
    elif effect == 'desk_bloom':
        overlay = Image.alpha_composite(overlay, radial_glow(image.size, (1180, 490), 260, '#ffd9ac', 0.1))
    elif effect == 'code_panel':
        panel = Image.new('RGBA', image.size, (0, 0, 0, 0))
        panel_draw = ImageDraw.Draw(panel)
        for bounds in [(120, 120, 560, 340), (980, 150, 1430, 350)]:
            panel_draw.rounded_rectangle(bounds, radius=28, fill=(14, 35, 58, 142), outline=(129, 220, 255, 180), width=2)
            for row in range(7):
                y = bounds[1] + 34 + row * 24
                x1 = bounds[0] + 24
                x2 = bounds[2] - 90 - (row % 3) * 40
                panel_draw.rounded_rectangle((x1, y, x2, y + 8), radius=4, fill=(148, 225, 255, 100))
        overlay = Image.alpha_composite(overlay, panel.filter(ImageFilter.GaussianBlur(0.3)))
    elif effect == 'fractal':
        points = [(930, 190), (1130, 280), (1010, 420), (1210, 500), (990, 640)]
        line(draw, points, (148, 214, 255, 160), 3)
        for x, y in points:
            draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(194, 232, 255, 180))
        for _ in range(26):
            x = rng.randint(860, 1320)
            y = rng.randint(140, 650)
            draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(201, 235, 255, rng.randint(70, 130)))
    elif effect == 'hearts':
        for x, y, size in [(1160, 210, 38), (1260, 300, 28), (1080, 340, 24)]:
            heart = Image.new('RGBA', image.size, (0, 0, 0, 0))
            heart_draw = ImageDraw.Draw(heart)
            heart_draw.ellipse((x - size, y - size, x, y), fill=(255, 195, 224, 120))
            heart_draw.ellipse((x, y - size, x + size, y), fill=(255, 195, 224, 120))
            heart_draw.polygon([(x - size - 6, y - 8), (x + size + 6, y - 8), (x, y + size + 24)], fill=(255, 195, 224, 110))
            overlay = Image.alpha_composite(overlay, heart.filter(ImageFilter.GaussianBlur(7)))
    elif effect == 'score_board':
        board = Image.new('RGBA', image.size, (0, 0, 0, 0))
        board_draw = ImageDraw.Draw(board)
        bounds = (970, 90, 1470, 300)
        board_draw.rounded_rectangle(bounds, radius=28, fill=(255, 247, 237, 186), outline=(213, 165, 90, 180), width=3)
        board_draw.rounded_rectangle((1010, 140, 1330, 158), radius=9, fill=(246, 189, 104, 130))
        board_draw.rounded_rectangle((1010, 180, 1270, 198), radius=9, fill=(122, 183, 255, 130))
        board_draw.rounded_rectangle((1010, 220, 1370, 238), radius=9, fill=(249, 140, 140, 130))
        board_draw.ellipse((1346, 136, 1386, 176), fill=(255, 196, 102, 200))
        overlay = Image.alpha_composite(overlay, board.filter(ImageFilter.GaussianBlur(0.4)))
    elif effect == 'paper_sheets':
        for bounds, angle in [((1040, 150, 1360, 470), -7), ((1150, 260, 1470, 600), 8)]:
            sheet = Image.new('RGBA', image.size, (0, 0, 0, 0))
            ImageDraw.Draw(sheet).rounded_rectangle(bounds, radius=22, fill=(255, 251, 246, 180), outline=(213, 190, 165, 190), width=2)
            sheet = sheet.rotate(angle, resample=Image.Resampling.BICUBIC)
            overlay = Image.alpha_composite(overlay, sheet)
    elif effect == 'gold_sparks':
        for _ in range(36):
            x = rng.randint(880, 1420)
            y = rng.randint(60, 540)
            r = rng.randint(3, 6)
            draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 209, 120, rng.randint(90, 170)))
    elif effect == 'fireworks':
        for center_x, center_y, color in [(1180, 140, '#ffcf7e'), (980, 220, '#8cd4ff'), (1350, 250, '#ffc2dd')]:
            for angle in range(0, 360, 20):
                radius = rng.randint(44, 92)
                x = center_x + math.cos(math.radians(angle)) * radius
                y = center_y + math.sin(math.radians(angle)) * radius
                draw.line((center_x, center_y, x, y), fill=ImageColor.getrgb(color) + (140,), width=3)
            overlay = Image.alpha_composite(overlay, radial_glow(image.size, (center_x, center_y), 120, color, 0.16))
    elif effect == 'warm_bloom':
        overlay = Image.alpha_composite(overlay, radial_glow(image.size, (1180, 190), 340, '#ffd0aa', 0.22))
    elif effect == 'night_bloom':
        overlay = Image.alpha_composite(overlay, radial_glow(image.size, (1210, 180), 300, '#e7f2ff', 0.08))

    return Image.alpha_composite(image, overlay.filter(ImageFilter.GaussianBlur(1.4)))


def add_character(base: Image.Image, spec: dict[str, object]) -> Image.Image:
    path = CHARACTER_ROOT / str(spec['id']) / f"{spec['expression']}.webp"
    sprite = Image.open(path).convert('RGBA')
    scale = float(spec.get('scale', 1.0))
    target_height = round(CANVAS_SIZE[1] * scale)
    target_width = round(sprite.width * (target_height / sprite.height))
    sprite = sprite.resize((target_width, target_height), Image.Resampling.LANCZOS)
    alpha = float(spec.get('alpha', 1.0))
    if alpha < 1:
        sprite.putalpha(sprite.getchannel('A').point(lambda value: round(value * alpha)))

    x = round(CANVAS_SIZE[0] * float(spec.get('x', 0.5)) - sprite.width / 2)
    y = CANVAS_SIZE[1] - sprite.height + round(float(spec.get('y_shift', 0.0)) * CANVAS_SIZE[1])

    shadow = sprite.getchannel('A').filter(ImageFilter.GaussianBlur(18))
    shadow_layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    shadow_layer.paste(Image.new('RGBA', sprite.size, (32, 18, 12, 110)), (x + 12, y + 12), shadow)
    base = Image.alpha_composite(base, shadow_layer)

    glow_color = spec.get('glow')
    if glow_color:
        base = Image.alpha_composite(base, radial_glow(base.size, (x + sprite.width * 0.55, y + sprite.height * 0.42), sprite.height * 0.42, str(glow_color), 0.14))

    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    layer.paste(sprite, (x, y), sprite)
    return Image.alpha_composite(base, layer)


def save_webp(image: Image.Image, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    image.convert('RGB').save(target, **SAVE_OPTIONS)


def generate_backgrounds() -> None:
    for scene, variants in BACKGROUND_SPECS.items():
        for time_key, spec in variants.items():
            image = load_image(spec['source'])
            image = grade_background(image, spec['preset'])
            for effect in spec.get('effects', []):
                image = add_particles(image, effect, f'{scene}_{time_key}')
            save_webp(image, BACKGROUND_ROOT / scene / f'{time_key}.webp')
            print('BACKGROUND', scene, time_key)


def build_cg(spec_name: str, spec: dict[str, object]) -> Image.Image:
    scene, time_key = spec['background']
    image = Image.open(BACKGROUND_ROOT / scene / f'{time_key}.webp').convert('RGBA')
    image = add_bloom(image, 4, 0.04)

    overlay_color = spec.get('overlay')
    if overlay_color:
        image = tint(image, str(overlay_color), 0.0) if str(overlay_color).endswith('00') else Image.alpha_composite(image, Image.new('RGBA', image.size, ImageColor.getrgb(str(overlay_color)[:7]) + (int(str(overlay_color)[7:9], 16),)))

    for character in spec.get('characters', []):
        image = add_character(image, character)

    for effect in spec.get('effects', []):
        image = add_particles(image, effect, spec_name)

    return add_vignette(add_bloom(image, 10, 0.05), 0.16)


def generate_cg() -> None:
    for cg_id, spec in CG_SPECS.items():
        save_webp(build_cg(cg_id, spec), CG_ROOT / f'{cg_id}.webp')
        print('CG', cg_id)


def generate_title_hero() -> None:
    image = Image.open(BACKGROUND_ROOT / 'school_gate' / 'day.webp').convert('RGBA')
    image = add_character(image, {'id': 'nene', 'expression': 'gentle_smile', 'x': 0.18, 'scale': 0.84, 'alpha': 0.9, 'glow': '#f5bfd4'})
    image = add_character(image, {'id': 'ayase', 'expression': 'soft_smile', 'x': 0.5, 'scale': 0.82, 'alpha': 0.92, 'glow': '#ffbb7f'})
    image = add_character(image, {'id': 'murasame', 'expression': 'genuine_smile', 'x': 0.82, 'scale': 0.84, 'alpha': 0.9, 'glow': '#f0b27a'})
    for effect in ['petals', 'warm_bloom']:
        image = add_particles(image, effect, 'title_hero')
    save_webp(add_vignette(add_bloom(image, 10, 0.07), 0.14), UI_ROOT / 'title-hero.webp')
    print('UI title-hero')


def main() -> None:
    ensure_dirs()
    generate_backgrounds()
    generate_cg()
    generate_title_hero()


if __name__ == '__main__':
    main()
