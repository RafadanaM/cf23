#!/usr/bin/env bash

set -e

if [ -z "$CF_ZONE_ID" ] || [ -z "$CF_API_TOKEN" ]; then
    echo "Error: CF_ZONE_ID or CF_API_TOKEN is missing."
    exit 1
fi

echo "Init cache purge"

RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
          "files": [
            "https://cf23.rafadana.com",
            "https://cf23.rafadana.com/"
          ]
        }')

# check if success
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "Success: Cloudflare cache purged for index"
else
    echo "Error: Cloudflare cache purge failed."
    echo "$RESPONSE"
    exit 1
fi
