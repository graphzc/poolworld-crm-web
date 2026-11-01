#!/bin/sh
set -e

# Define output file
ENV_JS_PATH="/usr/share/nginx/html/env.js"

# Create env.js
echo "window._env_ = {" > $ENV_JS_PATH

# Loop through environment variables that start with "VITE_"
for var in $(printenv | grep '^VITE_' | awk -F= '{print $1}'); do
  value=$(printenv $var | sed 's/"/\\"/g') # escape double quotes
  echo "  $var: \"$value\"," >> $ENV_JS_PATH
done

echo "};" >> $ENV_JS_PATH

exec "$@"
