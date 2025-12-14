#!/bin/bash

# Script to patch React Native 0.83.0 graphicsConversions.h bug in gradle cache

echo "Searching for graphicsConversions.h in gradle cache..."

# Find all instances of graphicsConversions.h in gradle cache
find ~/.gradle/caches -name "graphicsConversions.h" -type f 2>/dev/null | while read file; do
    echo "Patching: $file"
    # Replace std::format with folly::to<std::string>
    sed -i.bak 's/return std::format("{}\%", dimension\.value);/return folly::to<std::string>(dimension.value) + "%";/g' "$file"
    if [ $? -eq 0 ]; then
        echo "  ✓ Patched successfully"
    else
        echo "  ✗ Failed to patch"
    fi
done

echo "Patch complete!"
