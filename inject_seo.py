#!/usr/bin/env python3
"""Make every Tantra Authority page share-ready: real favicon links + og:image +
twitter card. Idempotent — safe to re-run."""
import re, glob, os
ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://tantra-authority.com"
OG = SITE + "/assets/og-default.png"
NL = chr(10)

FAVI = '''<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">'''

OGBLOCK = ('<meta property="og:image" content="' + OG + '">' + NL +
           '<meta property="og:image:width" content="1200">' + NL +
           '<meta property="og:image:height" content="630">' + NL +
           '<meta name="twitter:image" content="' + OG + '">' + NL +
           '<meta name="twitter:card" content="summary_large_image">')

def patch(path):
    s = open(path).read(); orig = s
    s = re.sub(r'<link rel="icon" href="data:image/svg\+xml,.*?>\s*', FAVI + NL, s, flags=re.S)
    if "/favicon.ico" not in s:
        s = s.replace("</head>", FAVI + NL + "</head>", 1)
    if 'property="og:image"' not in s:
        if 'name="twitter:card"' in s:
            s = re.sub(r'<meta name="twitter:card"[^>]*>', OGBLOCK, s, count=1)
        else:
            s = s.replace("</head>", OGBLOCK + NL + "</head>", 1)
    elif 'name="twitter:card"' not in s:
        s = s.replace("</head>", '<meta name="twitter:card" content="summary_large_image">' + NL + "</head>", 1)
    if s != orig:
        open(path, "w").write(s); return True
    return False

files = glob.glob(os.path.join(ROOT, "*.html")) + glob.glob(os.path.join(ROOT, "articles", "*.html"))
n = sum(patch(f) for f in files)
print("patched %d/%d pages" % (n, len(files)))
