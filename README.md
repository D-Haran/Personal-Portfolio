# derrickratnaharan.com

Personal portfolio: Next.js 16 (App Router, fully static) + Tailwind v4. Runtime dependencies: `next`, `react`, `react-dom`, and `three` (loaded lazily, only for the About section's 3D viewer — it is not in the initial bundle). No animation library; all motion is CSS plus `IntersectionObserver`, apart from one small background canvas, and it respects `prefers-reduced-motion`.

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
| 3D models (glTF) | `public/models/` — see **3D models** below |
| Resume PDF | `public/Derrick_Ratnaharan_Resume.pdf` (copied from `~/Documents/Resumes/`) |
| Resume preview image | `public/resume-preview.jpg` — regenerate with `pdftoppm -jpeg -r 150 -f 1 -l 1 <pdf> resume` |
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

Drop a `.glb` into `public/models/` and change that entry's `model` in `lib/likes.ts`. The scene auto-centres and auto-scales whatever it finds, fitting it to the entry's `r`, so usually only `yaw` / `pitch` want a nudge.

`pos` is `[x, y]` as a fraction of the **shorter** side of the area, `(0,0)` is the centre and `+y` is up; `r` is the radius the model is fitted into, in the same units. Entries are kept collision-free by hand — after moving anything, check that for every pair `distance(posA, posB) > rA + rB`, or models will intersect as they turn.

Sketchfab models can't be fetched automatically (downloads are behind a login), so they have to be downloaded by hand. Prefer glTF/GLB on export, and watch the triangle count: anything over ~20k triangles per model, or with 2K+ PBR textures, will dwarf the rest of the page. `scripts/` has no tooling for this; the textures in the current set were downscaled to 256px by hand.

## Deploy

Push to GitHub and import the repo on Vercel; no config needed. Set `NEXT_PUBLIC_SITE_URL` to the final domain so metadata, the sitemap and Open Graph links are correct.
