#!/bin/bash
# Usage: ./update-floating-tag.sh <version>

MAJOR_VERSION=$(echo "$1" | cut -d '.' -f 1)
FLOATING_TAG="v$MAJOR_VERSION"
VERSION_TAG="v$1"
git tag -d "$FLOATING_TAG"              # Delete the old local floating tag
git tag "$FLOATING_TAG" "$VERSION_TAG"  # Create new floating tag pointing to the released version
git push origin "$FLOATING_TAG" --force # Force update the remote floating tag
