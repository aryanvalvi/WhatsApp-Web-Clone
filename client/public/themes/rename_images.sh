#!/bin/bash
# Renames image files in current directory to bg1, bg2, ... preserving extension.

i=1
for f in *.jpg *.jpeg *.png *.gif *.webp *.heic; do
  # skip if no files match
  [ -e "$f" ] || continue

  ext="${f##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  newname="bg${i}.${ext_lower}"
  echo "Renaming: $f -> $newname"
  mv -- "$f" "$newname"
  i=$((i+1))
done

echo "Done. Renamed $((i-1)) files."
