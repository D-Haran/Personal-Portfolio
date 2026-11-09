# derrickratnaharan.com

Personal portfolio: Next.js 16 (App Router, fully static) + Tailwind v4. Only runtime dependencies: `next`, `react`, `react-dom`. No animation library; all motion is CSS plus `IntersectionObserver`, and it respects `prefers-reduced-motion`.

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
| Case studies | `app/work/{kestrel,repograph,campify}/page.tsx` |
| RepoGraph explorer data (from the real fixture) | `components/case/ImpactExplorer.tsx` |
| Resume PDF | `public/Derrick_Ratnaharan_Resume.pdf` (copied from `~/Documents/Resumes/`) |
| Photo / screenshots | `public/derrick.jpg`, `public/campify/` |
| Colours, fonts, motion | `app/globals.css` (`@theme` tokens at the top) |

## Deploy

Push to GitHub and import the repo on Vercel; no config needed. Set `NEXT_PUBLIC_SITE_URL` to the final domain so metadata, the sitemap and Open Graph links are correct.
