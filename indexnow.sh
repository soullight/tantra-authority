#!/usr/bin/env bash
# Ping IndexNow so search engines re-crawl tantra-authority.com after a deploy.
# Submits every URL in sitemap.xml. Key file lives at the site root.
set -euo pipefail
HOST="tantra-authority.com"
KEY="9f0ff94fc6e7196eea6eba9daf3551a9"
URLS=$(curl -sS "https://$HOST/sitemap.xml" | grep -o "<loc>[^<]*" | sed 's/<loc>//' | python3 -c "import sys,json; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))")
curl -sS -w "\nHTTP %{http_code}\n" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":$URLS}"
