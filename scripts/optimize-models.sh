#!/usr/bin/env bash
# Rebuilds public/models/*.glb from the untouched downloads in assets/models-src/.
#
# These models render at 40-180 CSS px inside the About cluster, so the source
# files (19 MB total, 203k triangles and 2048px textures in the car alone) are
# orders of magnitude more detail than any pixel can show. Each one is welded,
# decimated, joined into as few draw calls as possible, given 128-256px WebP
# textures and meshopt-compressed.
#
# simplify-error is a fraction of each mesh's own extent, and meshoptimizer
# stops short of the ratio rather than exceed it, so the ratios below are
# targets and the error bound is the real guarantee.
#
# Usage: npm run models   (needs the @gltf-transform/cli devDependency)
set -euo pipefail
cd "$(dirname "$0")/.."

opt() {
  local name=$1 tex=$2 ratio=$3 err=$4
  shift 4
  echo "--- $name (textures ${tex}px, target ratio ${ratio}, error ${err})"
  npx gltf-transform optimize "assets/models-src/$name.glb" "public/models/$name.glb" \
    --compress meshopt \
    --texture-compress webp \
    --texture-size "$tex" \
    --simplify-ratio "$ratio" \
    --simplify-error "$err" \
    --no-instance \
    "$@"
}

# --no-join on the car is not a preference. Joining it moves geometry: its
# bounding box goes from 1.43 x 0.67 x 2.03 to 2.13 x 1.55 x 2.42, which the
# cluster then auto-fits, so the car renders visibly wrong. Its meshes are all
# named and distinct, so --no-join-meshes / --no-join-named join nothing at all
# and the choice is the whole pass or none of it. It costs 195 draw calls for
# that one model; verify/check.mjs is what catches this if the flags change.

#    model          tex   ratio   error   extra
opt car            256   0.18    0.010   --no-join
opt eguitar        256   0.25    0.006
opt rubiks         256   0.25    0.004
opt videocamera    256   0.30    0.006
opt headphones     128   0.45    0.006
opt basketball     128   0.60    0.006
opt baseball       128   0.80    0.006
