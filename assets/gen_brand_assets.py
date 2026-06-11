#!/usr/bin/env python3
"""Generate Tantra Authority brand assets: favicon (multi-size .ico + png + apple-touch)
and the og-default.png share card (1200x630) so pasted links show a rich preview."""
import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
GEORGIA = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
INK = (12, 10, 20); INK2 = (22, 16, 32); GOLD = (217, 178, 94); GOLD_HI = (244, 214, 145)

# ---------- favicon: gold lotus/mandala on midnight, big & legible at 16px ----------
def favicon(sz):
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    d = ImageDraw.Draw(img); c = sz/2
    d.ellipse([1, 1, sz-2, sz-2], fill=INK)                      # midnight disc
    d.ellipse([sz*0.06, sz*0.06, sz*0.94, sz*0.94], outline=GOLD, width=max(1, sz//32))
    petals = 8
    for k in range(petals):                                       # gold petals
        a = 2*math.pi*k/petals
        x = c + (sz*0.26)*math.cos(a); y = c + (sz*0.26)*math.sin(a)
        r = sz*0.13
        d.ellipse([x-r, y-r, x+r, y+r], outline=GOLD, width=max(1, sz//40))
    d.ellipse([c-sz*0.11, c-sz*0.11, c+sz*0.11, c+sz*0.11], fill=GOLD)   # gold core
    d.ellipse([c-sz*0.04, c-sz*0.04, c+sz*0.04, c+sz*0.04], fill=INK)
    return img

ico = favicon(256)
ico.save(os.path.join(HERE, "favicon.ico"), sizes=[(16,16),(32,32),(48,48),(64,64)])
favicon(32).save(os.path.join(HERE, "favicon-32.png"))
favicon(180).resize((180,180)).save(os.path.join(HERE, "apple-touch-icon.png"))
print("favicons written")

# ---------- og-default.png : peacock + brand text, 1200x630 ----------
W, Hh = 1200, 630
og = Image.new("RGB", (W, Hh), INK)
# midnight gradient
top = Image.new("RGB", (W, Hh), INK2)
mask = Image.new("L", (W, Hh))
md = ImageDraw.Draw(mask)
for y in range(Hh): md.line([(0,y),(W,y)], fill=int(60*(1-y/Hh)))
og = Image.composite(top, og, mask)
# peacock on the right, bled + darkened toward the left
peacock = Image.open(os.path.join(HERE, "shop-hero.png")).convert("RGB")
ph = Hh; pw = int(peacock.width * ph/peacock.height)
peacock = peacock.resize((pw, ph))
og.paste(peacock, (W-pw, 0))
# fade peacock into the bg on its left edge
fade = Image.new("L", (pw, Hh), 0)
fd = ImageDraw.Draw(fade)
for x in range(pw): fd.line([(x,0),(x,Hh)], fill=min(255, int(300*(x/pw))))
left = og.crop((W-pw, 0, W, Hh))
base = Image.new("RGB", (pw, Hh), INK)
og.paste(Image.composite(left, base, fade), (W-pw, 0))
d = ImageDraw.Draw(og)
title = ImageFont.truetype(GEORGIA, 92)
sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 38)
d.text((70, 210), "TANTRA", font=title, fill=GOLD_HI)
d.text((70, 300), "AUTHORITY", font=title, fill=GOLD)
d.text((74, 415), "Tantra without the mythology.", font=sub, fill=(220,210,225))
d.line([(74, 200),(74, 392)], fill=GOLD, width=4)
og.save(os.path.join(HERE, "og-default.png"), quality=90)
print("og-default.png written", og.size)
