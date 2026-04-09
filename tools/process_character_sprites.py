"""Process NoranekoGames sprite PNGs into game-ready WebP files."""
from __future__ import annotations

import gc
import sys
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PROJECT_ROOT / "tmp_assets" / "character_sources"
CHARACTER_ROOT = PROJECT_ROOT / "public" / "assets" / "characters"

TARGET_HEIGHT = 1080
WEBP_OPTS = {"format": "WEBP", "quality": 88, "method": 4}

SPRITE_MAP = {
    "nene": (
        SOURCE_ROOT / "Rin_NoranekoGames" / "Rin" / "Summer_Uniform",
        {
            "normal":       "Rin_SummerUni_Smile.png",
            "smile":        "Rin_SummerUni_OpenSmile.png",
            "gentle_smile": "Rin_SummerUni_Smile_ClosedEyes.png",
            "blush":        "Rin_SummerUni_Smile_Blush.png",
            "confused":     "Rin_SummerUni_Frown.png",
            "surprised":    "Rin_SummerUni_OpenSmile_Blush.png",
            "sad":          "Rin_SummerUni_Frown_ClosedEyes.png",
            "thinking":     "Rin_SummerUni_Frown_Blush.png",
        },
    ),
    "yoshino": (
        SOURCE_ROOT / "Natsumi_NoranekoGames" / "Summer_Uniform",
        {
            "normal":         "Natsumi_SummerUni_Frown.png",
            "cold":           "Natsumi_SummerUni_Closed_Frown.png",
            "slight_smile":   "Natsumi_SummerUni_Smile.png",
            "blush":          "Natsumi_SummerUni_Smile_Blush.png",
            "tsundere_pout":  "Natsumi_SummerUni_Frown_Blush.png",
            "angry":          "Natsumi_SummerUni_Open.png",
            "glasses_adjust": "Natsumi_SummerUni_Closed_Smile.png",
            "rare_gentle":    "Natsumi_SummerUni_Closed_Open_Blush.png",
        },
    ),
    "ayase": (
        SOURCE_ROOT / "NoranekoGames_Sabrina_BasePack" / "Summer Uniform",
        {
            "normal":      "Sabby_SummerUni_Smile.png",
            "grin":        "Sabby_SummerUni_Open.png",
            "competitive": "Sabby_SummerUni_Frown.png",
            "blush":       "Sabby_SummerUni_Smile_Blush.png",
            "pout":        "Sabby_SummerUni_Frown_Blush.png",
            "fired_up":    "Sabby_SummerUni_Open_Blush.png",
            "surprised":   "Sabby_SummerUni_Closed_Open.png",
            "soft_smile":  "Sabby_SummerUni_Closed_Smile_Blush.png",
        },
    ),
    "kanna": (
        SOURCE_ROOT / "Winter Seifuku",
        {
            "normal":        "Kana_Wintersei_Smile.png",
            "slight_smile":  "Kana_Wintersei_Open.png",
            "absorbed":      "Kana_Wintersei_Closed_Smile.png",
            "blush":         "Kana_Wintersei_Smile_Blush.png",
            "surprised":     "Kana_Wintersei_Open_Blush.png",
            "contemplative": "Kana_Wintersei_Closed_Frown.png",
            "warm_smile":    "Kana_Wintersei_Closed_Smile_Blush.png",
            "teary":         "Kana_Wintersei_Frown_Blush.png",
        },
    ),
    "murasame": (
        SOURCE_ROOT / "Ichiko Casual",
        {
            "normal":        "Ichiko_Casual_Frown.png",
            "smirk":         "Ichiko_Casual_Smile.png",
            "impressed":     "Ichiko_Casual_Pout.png",
            "blush":         "Ichiko_Casual_Smile_Blush.png",
            "cold":          "Ichiko_Casual_Closed_Frown.png",
            "genuine_smile": "Ichiko_Casual_Closed_Smile_Blush.png",
            "vulnerable":    "Ichiko_Casual_Frown_Blush.png",
            "fierce":        "Ichiko_Casual_Shout.png",
        },
    ),
}


def convert_one(src: Path, dst: Path) -> None:
    img = Image.open(src).convert("RGBA")
    ratio = TARGET_HEIGHT / img.height
    new_w = round(img.width * ratio)
    img = img.resize((new_w, TARGET_HEIGHT), Image.Resampling.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, **WEBP_OPTS)
    size_kb = dst.stat().st_size // 1024
    print(f"  {dst.stem}: {new_w}x{TARGET_HEIGHT}  ({size_kb} KB)")
    del img
    gc.collect()


def main() -> None:
    chars = sys.argv[1:] if len(sys.argv) > 1 else list(SPRITE_MAP.keys())
    for char_id in chars:
        if char_id not in SPRITE_MAP:
            print(f"Unknown character: {char_id}")
            continue
        src_dir, expressions = SPRITE_MAP[char_id]
        print(f"\n=== {char_id} ===")
        for expr_name, filename in expressions.items():
            src = src_dir / filename
            if not src.exists():
                print(f"  MISSING: {filename}")
                continue
            dst = CHARACTER_ROOT / char_id / f"{expr_name}.webp"
            convert_one(src, dst)
        sys.stdout.flush()
    print("\nDone!")


if __name__ == "__main__":
    main()
