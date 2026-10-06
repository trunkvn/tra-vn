# Ấm Trà — the Vietnamese way of tea

A single scrolling page about Vietnamese tea culture: seven teas, how tea is brewed the old Hà Nội way, and the manners of offering a cup. The text is in English, with Vietnamese terms woven in.

The layout is inspired by [Mâm Cơm — the Vietnamese family rice tray](https://the-family-rice-tray.vercel.app/), with the subject swapped for tea. The SVG drawings and the 3D model were drawn from scratch; the photos, music and text have their own sources, listed under [Credits and licences](#credits-and-licences).

## Sections

| Section | Folder | What it holds |
|---|---|---|
| Header | `components/masthead` | Logo, navigation with a steam "cloud" that glides to the section in view, the "Mời trà!" plaque |
| Hero | `components/hero` | Title, animated teapot drawing, strip of the seven teas, music button |
| Seven teas | `components/leaves` | A round tray you can spin (drag, arrow keys, click a cup) with a detail card for each tea |
| A full tea tray | `components/feast` | An interactive 3D tea tray (three.js) |
| Legend · Origins | `components/legend` | The history of tea in Việt Nam, with an animated drawing |
| Brew | `components/brew` | The traditional way of brewing |
| Manners | `components/manners` | Six rules for offering tea |
| The greeting | `components/closer` | "Mời trà!" |
| Footer | `components/credits` | A frieze that drifts sideways, plus photo and music credits |

## Tech

- [Next.js](https://nextjs.org) 16 (App Router) and React 19, written in TypeScript
- Tailwind CSS 4 for the base layer only; most of the styling is plain CSS, one `.css` file beside each component
- [three.js](https://threejs.org) for the 3D tray, loaded only when you scroll near it
- Be Vietnam Pro via `next/font`; Big Shoulders is self-hosted from `public/fonts/` with plain `@font-face` (in `app/globals.css`), because `next/font` has no size metrics for it and Turbopack warned on every build

> This version of Next.js differs a lot from older ones. Before changing anything framework-related, read the docs that ship in `node_modules/next/dist/docs/` (see also [AGENTS.md](AGENTS.md)).

## Running it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3001
npm run build      # production build
npm run start      # serve the production build
npm run lint
```

Measure performance on a `build` + `start`, never on `npm run dev`.

## Project layout

```
app/                  layout, home page, colour variables and shared styles (globals.css)
components/<section>/ each section's component and its CSS
components/leaves/    teas.ts (the seven teas), credits.ts (photo credits)
public/art/           hand-drawn SVGs (several animate with CSS inside the SVG file itself)
public/photos/        tea photographs
public/audio/         the background track
public/fonts/         the self-hosted display font (Big Shoulders, SIL Open Font License)
next.config.ts        cache headers for public/, allowed image qualities for next/image
```

## Credits and licences

- **Photos:** mostly from [Wikimedia Commons](https://commons.wikimedia.org/) under the licence each author chose (CC0, Public Domain, CC BY, CC BY-SA); the full list is in the footer and in `credits.ts`. **Three photos (lotus tea, mạn tea, black tea) come from Pinterest, and their author and licence could not be verified** — replace them with images you have the right to use before the site goes public.
- **Music:** "’laxin" (Lo Fi Background Music) by Kuromaru ft .hereafter, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via Wikimedia Commons, converted to MP3 and level-matched. CC BY requires crediting the author, so do not remove the credit line in the hero and the footer.
- **Text:** written from articles by [Thuận Trà Thái Nguyên](https://thuantrathainguyen.com/blogs/news/lich-su-tra-viet-nguon-goc-su-phat-trien), [Haba](https://haba.vn/van-hoa-uong-tra-cua-nguoi-viet/), [Kinh tế & Đồ uống](https://kinhtedouong.vn/le-nghi-trong-van-hoa-tra-viet-90208.html) and [Vinatea](https://travinatea.com.vn/blogs/van-hoa-tra/su-tinh-te-trong-cach-thuong-tra-cua-nguoi-ha-noi-xua). These are articles from tea sellers and the trade press, not academic histories, and dates before the 20th century are approximate. The English renderings of Vietnamese terms are the project author's own.
- **SVG drawings and the 3D model:** made for this project.

