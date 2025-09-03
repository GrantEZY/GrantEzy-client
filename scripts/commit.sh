#!/bin/bash

# Step 1: Generate .env.example from all .env* files (keys only) recursively
tmp_file=".env.example.tmp"
> "$tmp_file"  # Clear/create the temporary file

# Find all .env* files recursively, excluding .env.example and temp files
find . -name ".env*" -type f | while read -r env_file; do
  # Get just the filename for comparison
  filename=$(basename "$env_file")

  # Exclude files that shouldn't be processed
  if [[ "$filename" != ".env.example" && "$filename" != "$(basename "$tmp_file")" ]]; then
    echo "Processing: $env_file"
    # Extract keys from the file and append to temp file
    awk -F '=' '/^[^#[:space:]]/ && NF { print $1"=" }' "$env_file" >> "$tmp_file"
  fi
done

# Sort and remove duplicates
sort -u "$tmp_file" -o "$tmp_file"

# Only update .env.example if contents differ
if ! cmp -s "$tmp_file" .env.example; then
  mv "$tmp_file" .env.example
  git add .env.example
  echo "✅ Updated .env.example"
else
  rm "$tmp_file"
  echo "ℹ️  No changes needed for .env.example"
fi

# Step 2: Prompt for commit info
read -p "Type (e.g., feat, fix, chore): " TYPE
read -p "Scope (optional): " SCOPE
read -p "Message: " MSG

# Step 3: Construct commit message
if [ -n "$SCOPE" ]; then
  COMMIT_MSG="$TYPE($SCOPE): $MSG"
else
  COMMIT_MSG="$TYPE: $MSG"
fi

# Step 4: Add remaining changes
git add .

# Step 5: Commit
git commit -m "$COMMIT_MSG"

# Step 6: Report status
if [ $? -eq 0 ]; then
  echo "✅ Committed with message: \"$COMMIT_MSG\""
else
  echo "❌ Commit failed."
fi
