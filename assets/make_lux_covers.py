#!/usr/bin/env python3
"""Premium gold-on-black luxury course covers (no figure) — flagship feel.
Square 1024, matches the chakra cover's gold+midnight family. Pure design, no GPU.
cairosvg → PNG. Output: ./lux/*.png
"""
import os, math, cairosvg
OUT = os.path.join(os.path.dirname(__file__), "lux"); os.makedirs(OUT, exist_ok=True)
S = 1024
GOLD = "#d9b25e"; GOLD_HI = "#f4d691"; INK = "#0c0a14"; INK2 = "#161020"

def ring_dots(cx, cy, r, n, rad, fill, op):
    out = ""
    for k in range(n):
        a = 2*math.pi*k/n
        out += f'<circle cx="{cx+r*math.cos(a):.1f}" cy="{cy+r*math.sin(a):.1f}" r="{rad}" fill="{fill}" opacity="{op}"/>'
    return out

def rays(cx, cy, r0, r1, n, stroke, w, op):
    out = ""
    for k in range(n):
        a = 2*math.pi*k/n
        out += (f'<line x1="{cx+r0*math.cos(a):.1f}" y1="{cy+r0*math.sin(a):.1f}" '
                f'x2="{cx+r1*math.cos(a):.1f}" y2="{cy+r1*math.sin(a):.1f}" stroke="{stroke}" stroke-width="{w}" opacity="{op}"/>')
    return out

def star_poly(cx, cy, r, n, step):
    pts = []
    for k in range(n):
        a = 2*math.pi*(k*step % n)/n - math.pi/2
        pts.append(f"{cx+r*math.cos(a):.1f},{cy+r*math.sin(a):.1f}")
    return " ".join(pts)

HEAD = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">
<defs>
  <radialGradient id="bg" cx="50%" cy="44%" r="72%">
    <stop offset="0%" stop-color="{INK2}"/><stop offset="62%" stop-color="{INK}"/><stop offset="100%" stop-color="#050409"/>
  </radialGradient>
  <radialGradient id="glow" cx="50%" cy="44%" r="42%">
    <stop offset="0%" stop-color="{GOLD_HI}" stop-opacity="0.55"/>
    <stop offset="40%" stop-color="{GOLD}" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="{GOLD}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="{GOLD_HI}"/><stop offset="50%" stop-color="{GOLD}"/><stop offset="100%" stop-color="#a9822f"/>
  </linearGradient>
</defs>
<rect width="{S}" height="{S}" fill="url(#bg)"/>
<rect width="{S}" height="{S}" fill="url(#glow)"/>'''
FOOT = "</svg>"
CX = CY = S/2

def v_solar():
    s = HEAD
    s += rays(CX, CY, 70, 380, 96, GOLD, 0.7, 0.18)
    s += rays(CX, CY, 90, 300, 48, GOLD_HI, 0.8, 0.30)
    for r,op in [(150,0.5),(210,0.4),(280,0.32),(350,0.22),(410,0.16)]:
        s += f'<circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="{GOLD}" stroke-width="0.8" opacity="{op}"/>'
    s += ring_dots(CX, CY, 320, 72, 1.6, GOLD, 0.55)
    s += f'<circle cx="{CX}" cy="{CY}" r="58" fill="url(#goldgrad)" opacity="0.95"/>'
    s += f'<circle cx="{CX}" cy="{CY}" r="58" fill="none" stroke="{GOLD_HI}" stroke-width="1.2" opacity="0.9"/>'
    s += f'<circle cx="{CX}" cy="{CY}" r="30" fill="none" stroke="{INK}" stroke-width="1" opacity="0.5"/>'
    return s + FOOT

def v_geometry():
    s = HEAD
    for r,op in [(120,0.5),(180,0.42),(250,0.34),(330,0.24),(400,0.16)]:
        s += f'<circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="{GOLD}" stroke-width="0.7" opacity="{op}"/>'
    for n,r,step,op in [(12,360,5,0.5),(9,300,4,0.45),(7,240,3,0.5)]:
        s += f'<polygon points="{star_poly(CX,CY,r,n,step)}" fill="none" stroke="url(#goldgrad)" stroke-width="0.9" opacity="{op}"/>'
    s += ring_dots(CX, CY, 410, 96, 1.3, GOLD, 0.5)
    s += rays(CX, CY, 0, 110, 24, GOLD, 0.6, 0.3)
    s += f'<circle cx="{CX}" cy="{CY}" r="44" fill="url(#goldgrad)" opacity="0.92"/>'
    s += f'<circle cx="{CX}" cy="{CY}" r="44" fill="none" stroke="{GOLD_HI}" stroke-width="1" opacity="0.8"/>'
    return s + FOOT

def v_halo():
    s = HEAD
    s += ring_dots(CX, CY, 300, 160, 1.1, GOLD, 0.45)
    s += ring_dots(CX, CY, 360, 200, 1.0, GOLD_HI, 0.35)
    for r,op in [(170,0.55),(176,0.3)]:
        s += f'<circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="url(#goldgrad)" stroke-width="2.4" opacity="{op}"/>'
    s += rays(CX, CY, 178, 250, 120, GOLD, 0.5, 0.16)
    s += f'<circle cx="{CX}" cy="{CY}" r="150" fill="none" stroke="{GOLD}" stroke-width="0.6" opacity="0.4"/>'
    s += f'<circle cx="{CX}" cy="{CY}" r="6" fill="{GOLD_HI}" opacity="0.95"/>'
    return s + FOOT

for name, fn in [("a_solar", v_solar), ("b_geometry", v_geometry), ("c_halo", v_halo)]:
    svg = fn()
    cairosvg.svg2png(bytestring=svg.encode(), write_to=os.path.join(OUT, f"lux_{name}.png"), output_width=S, output_height=S)
    print("rendered", name)
print("DONE", OUT)
