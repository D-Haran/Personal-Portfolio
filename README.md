# derrickratnaharan.com

Personal portfolio: Next.js 16 (App Router, fully static) + Tailwind v4. Runtime dependencies: `next`, `react`, `react-dom`, and `three` (loaded lazily, only for the About section's 3D viewer, and not in the initial bundle). No animation library; all motion is CSS plus `IntersectionObserver`, apart from one small background canvas, and it respects `prefers-reduced-motion`.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
npm run lint
```

## Editing content

| What | Where |
|---|---|
| Name, links, email, status line, site URL | `lib/site.ts` → `site` |
| Project cards (summary, metrics, stack, links) | `lib/site.ts` → `projects` |
| Experience, awards, skills | `lib/site.ts` |
| "Currently" list and About copy | `components/home/About.tsx` |
| Case studies | `app/work/{campify,kestrel,cosign,shell}/page.tsx` |
| Shared case-study blocks (hero, metrics, prose, stack) | `components/case/Case.tsx` |
| Project card artwork | `components/visuals.tsx` |
| Background (drifting Rubik's cube stickers) | `components/Cubies.tsx` |
| About-section 3D cluster | `components/home/Likes.tsx`; layout + models in `lib/likes.ts` |
| 3D models (glTF) | `assets/models-src/` (source), `public/models/` (generated), see **3D models** below |
| Resume PDF | `public/Derrick_Ratnaharan_Resume.pdf` (copied from `~/Documents/Resumes/`) |
| Resume preview image | `public/resume-preview.jpg`, regenerate with `pdftoppm -jpeg -r 150 -f 1 -l 1 <pdf> resume` |
| Photo / screenshots | `public/derrick.jpg`, `public/campify/` |
| Colours, fonts, motion | `app/globals.css` (`@theme` tokens at the top) |

## 3D models

All seven render together in one scene. `public/models/*.glb` come from [Poly Pizza](https://poly.pizza); textures were downscaled to 256px and re-encoded (1.56 MB → 480 KB for the set), and the models are otherwise unmodified.

| File | Model | Author | License |
|---|---|---|---|
| `rubiks.glb` | Rubik's cube | Poly by Google | CC BY 3.0 |
| `car.glb` | Sports Car | Quaternius | CC0 |
| `eguitar.glb` | Electric guitar | Poly by Google | CC BY 3.0 |
| `headphones.glb` | Headphones | Poly by Google | CC BY 3.0 |
| `videocamera.glb` | Video Camera | dook | CC BY 3.0 |
| `basketball.glb` | Basketball | Poly by Google | CC BY 3.0 |
| `baseball.glb` | Baseball | Poly by Google | CC BY 3.0 |

**CC BY requires attribution**, rendered in the footer from `lib/likes.ts` → `modelCredits`. Keep that credit if you keep the models.

### Swapping a model

Drop the original `.glb` into `assets/models-src/`, change that entry's `model` in `lib/likes.ts`, then run `npm run models` (see **Optimizing the models** below) to produce the served copy in `public/models/`. The scene auto-centres and auto-scales whatever it finds, fitting it to the entry's `r`, so usually only `yaw` / `pitch` want a nudge.

`pos` is `[x, y]` as a fraction of the **shorter** side of the area, `(0,0)` is the centre and `+y` is up; `r` is the radius the model is fitted into, in the same units. Entries are kept collision-free by hand: after moving anything, check that for every pair `distance(posA, posB) > rA + rB`, or models will intersect as they turn.

Sketchfab models can't be fetched automatically (downloads are behind a login), so they have to be downloaded by hand. Prefer glTF/GLB on export, and don't worry about the triangle count or texture size of the download itself: the optimize step below is what the page actually serves.

### Optimizing the models

`public/models/` is **generated**. The originals live in `assets/models-src/` (outside `public/`, so they are never served) and `npm run models` rebuilds the served copies with [glTF-Transform](https://gltf-transform.dev/).

This matters more than it sounds. The downloads total 19 MB, and `car.glb` alone was 12 MB with 203k triangles, 195 draw calls and 2K textures, for something that renders 120 CSS px wide. On a cold cache that is what made the About section stutter. The pipeline welds, decimates, joins, downsizes textures to 128-256px WebP and meshopt-compresses each model:

| | Downloads | Served |
| --- | --- | --- |
| Total bytes | 19 MB | 1.4 MB |
| `car.glb` | 12.19 MB | 1.12 MB |
| Triangles | 321k | 74k |

Per-model texture sizes and decimation targets are at the bottom of `scripts/optimize-models.sh`. `simplify-error` is a fraction of each mesh's own extent and meshoptimizer stops short of the ratio rather than exceed it, so the ratios are targets and the error bound is the real guarantee.

**`npm run models:verify` after any change to those numbers.** It parses the original and the served copy through the same three.js the site uses and compares fitted silhouette and triangle count; everything should stay under ~0.5% drift. This is not ceremony: the full `join` pass silently moves the car's geometry (bounding box 1.43 x 0.67 x 2.03 to 2.13 x 1.55 x 2.42), which the cluster then auto-fits, so the car renders wrong at the right file size. That is why `car` alone is built with `--no-join`, and why the check exists.

The served files use `EXT_meshopt_compression`, `KHR_mesh_quantization` and `EXT_texture_webp`. All three are decoded by the bundled `GLTFLoader`, but the meshopt decoder has to be handed to it (`loader.setMeshoptDecoder` in `components/home/Likes.tsx`) or nothing loads at all.

## Deploy

Push to GitHub and import the repo on Vercel; no config needed. Set `NEXT_PUBLIC_SITE_URL` to the final domain so metadata, the sitemap and Open Graph links are correct.
