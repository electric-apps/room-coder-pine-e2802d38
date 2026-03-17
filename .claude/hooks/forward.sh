#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/e2802d38-4d98-4ca6-b531-076e6189b1ce/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer d57d79392a186684982a84db95ea139e93489a2bc5bd965659986b036c2818ea" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0