#!/bin/bash

if [ ! -f .vercelkeep ]; then
  echo "❌ Error: .vercelkeep file not found!"
  exit 1
fi

echo "✅ .vercelkeep file found."
ALL_FILES=$(git ls-files)
KEEP_FILES=$(cat .vercelkeep)

for file in $ALL_FILES; do
  if ! grep -qxF "$file" <(echo "$KEEP_FILES"); then
    echo "Removing $file"
    git rm --cached "$file" 2>/dev/null || echo "⚠️ $file is not tracked"
    rm -rf "$file" || echo "❌ Failed to delete $file locally."
  fi
done

echo "🎉 Cleaned repository! Only .vercelkeep files remain."