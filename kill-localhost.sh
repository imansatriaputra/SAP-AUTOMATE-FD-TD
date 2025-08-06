#!/usr/bin/env bash
# kill-localhost.sh: kill every process listening on any TCP port

# Gather all listening PIDs
mapfile -t pids < <(
  lsof -nP -iTCP -sTCP:LISTEN \
    | awk 'NR>1 {print $2}' \
    | sort -u
)

if [[ ${#pids[@]} -eq 0 ]]; then
  echo "✅ No listening TCP processes found."
  exit 0
fi

echo "🚨 Killing these PIDs: ${pids[*]}"
kill -9 "${pids[@]}"
echo "✅ Done."

# TO RUN
# chmod +x kill-localhost.sh
# ./kill-localhost.sh
