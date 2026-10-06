<div align="center">

<img src="public/art/teapot.svg" alt="" width="120" />

# Ấm Trà

### The Vietnamese way of tea

*Nhất thủy, nhì trà, tam bôi, tứ bình, ngũ quần anh* — "water, tea, cup, pot, good company"

A single scrolling page about Vietnamese tea culture: seven teas on a spinning tray, an interactive 3D tea set, the old Hà Nội way of brewing, and the manners of offering a cup.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-3D-000000?logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

<br />

<img src="docs/screenshots/hero.jpg" alt="Ấm Trà hero: the title, an animated line-drawn teapot and a strip of the seven teas" width="900" />

</div>

---

## About

In Việt Nam a hot cup of tea — *chén trà nóng* — is the first thing offered to a guest: a greeting, a wish for peace and a sign of welcome. **Ấm Trà** ("the teapot") is a small love letter to that custom, built as one long, slow page you scroll the way you would sip.

The text is in English, with Vietnamese terms woven in and glossed, so a reader who has never been to Việt Nam can follow along while still meeting the real words: *trà mạn*, *khay trà*, *lễ nghi*, *mời trà*.

It covers:

- **Seven teas**, from wild Shan *tuyết* trees and smoky *trà mạn* to Thái Nguyên green tea, lotus and jasmine teas scented in Hà Nội, oolong and export black tea.
- **A short history**, from the wild forests of the north to the plantations and the tea houses of Hà Nội.
- **How to brew**, step by step, the traditional Hà Nội way.
- **Six rules of the pot** — the manners of pouring, sharing and receiving tea.

The layout is inspired by [Mâm Cơm — the Vietnamese family rice tray](https://the-family-rice-tray.vercel.app/), with the subject swapped for tea.

## Preview

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/loader.jpg" alt="Loading screen: a teapot draws itself line by line while steam rises" /></td>
    <td width="50%"><img src="docs/screenshots/leaves.jpg" alt="The seven-tea tray with a detail card for green tea" /></td>
  </tr>
  <tr>
    <td align="center"><b>Loading screen</b><br />The teapot draws itself while the page loads.</td>
    <td align="center"><b>Seven teas on a circle</b><br />Spin the tray; each cup opens a detail card.</td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/feast.jpg" alt="An interactive 3D celadon tea tray with a pot and seven cups" /></td>
    <td width="50%"><img src="docs/screenshots/legend.jpg" alt="From the wild tea forest to the cup: a timeline of tea in Việt Nam" /></td>
  </tr>
  <tr>
    <td align="center"><b>A full tea tray</b><br />A 3D celadon pot and seven cups. Drag to turn.</td>
    <td align="center"><b>Từ rừng chè đến chén trà</b><br />A timeline from the wild forest to the cup.</td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/brew.jpg" alt="Pha trà kiểu Hà Nội: tools, water and the brewing method" /></td>
    <td width="50%"><img src="docs/screenshots/manners.jpg" alt="Six rules of the pot" /></td>
  </tr>
  <tr>
    <td align="center"><b>Pha trà kiểu Hà Nội</b><br />Tools, water and the method, step by step.</td>
    <td align="center"><b>Six rules of the pot</b><br />The manners of offering tea.</td>
  </tr>
</table>

<details>
<summary><b>On a phone</b></summary>
<br />

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/mobile-hero.jpg" alt="Mobile hero" /></td>
    <td width="50%"><img src="docs/screenshots/mobile-leaves.jpg" alt="Mobile seven-tea tray" /></td>
  </tr>
</table>

</details>

<details>
<summary><b>The greeting</b></summary>
<br />

<img src="docs/screenshots/closer.jpg" alt="Mời trà! — Please, have some tea." width="720" />

</details>

## Highlights

- **A teapot that draws itself.** The loading screen sketches a teapot line by line, lets steam rise and unfurls three leaves, then lifts like a curtain once the page and its fonts are ready. It carries a short bilingual note that the information may not be fully accurate.
- **A steam "cloud" in the navigation.** One little cloud glides along the header to whichever section you are reading. Hover a nav item to see its English meaning.
- **A tray you can spin.** Drag it, use the arrow keys, or click a cup. Each tea has its own card: where it grows, what it tastes like, how it is made.
- **A real 3D tea set.** A celadon pot and seven cups rendered with three.js, loaded only when you scroll near it.
- **Hand-drawn art.** The SVG illustrations are drawn from scratch and several animate with CSS inside the SVG file itself.
- **Background music.** A gentle lo-fi track, off until you press play.
- **Considerate by default.** Skip link, keyboard control of the tray, and reduced-motion support throughout.

## Sections

| Section | Folder | What it holds |
|---|---|---|
| Loader | `components/loader` | The self-drawing teapot loading screen |
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

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/trunkvn/tra-vn.git
cd tra-vn
npm install
npm run dev        # http://localhost:3001
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3001 |
| `npm run lint` | Lint with ESLint |

Measure performance on a `build` + `start`, never on `npm run dev`.

## Project layout

```
app/                  layout, home page, colour variables and shared styles (globals.css)
components/<section>/ each section's component and its CSS
components/leaves/    teas.ts (the seven teas), credits.ts (photo credits)
docs/screenshots/     the preview images used in this README
public/art/           hand-drawn SVGs (several animate with CSS inside the SVG file itself)
public/photos/        tea photographs
public/audio/         the background track
public/fonts/         the self-hosted display font (Big Shoulders, SIL Open Font License)
next.config.ts        cache headers for public/, allowed image qualities for next/image
```

## A note on accuracy

The page is a cultural introduction, not an academic source. Its text is drawn from articles by tea sellers and the trade press, and dates before the 20th century are approximate. The loading screen says as much, in Vietnamese and in English. Corrections are welcome.

## Credits and licences

- **Photos:** mostly from [Wikimedia Commons](https://commons.wikimedia.org/) under the licence each author chose (CC0, Public Domain, CC BY, CC BY-SA); the full list is in the footer and in `credits.ts`. **Three photos (lotus tea, mạn tea, black tea) come from Pinterest, and their author and licence could not be verified** — replace them with images you have the right to use before the site goes public.
- **Music:** "’laxin" (Lo Fi Background Music) by Kuromaru ft .hereafter, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) via Wikimedia Commons, converted to MP3 and level-matched. CC BY requires crediting the author, so do not remove the credit line in the hero and the footer.
- **Text:** written from articles by [Thuận Trà Thái Nguyên](https://thuantrathainguyen.com/blogs/news/lich-su-tra-viet-nguon-goc-su-phat-trien), [Haba](https://haba.vn/van-hoa-uong-tra-cua-nguoi-viet/), [Kinh tế & Đồ uống](https://kinhtedouong.vn/le-nghi-trong-van-hoa-tra-viet-90208.html) and [Vinatea](https://travinatea.com.vn/blogs/van-hoa-tra/su-tinh-te-trong-cach-thuong-tra-cua-nguoi-ha-noi-xua). These are articles from tea sellers and the trade press, not academic histories, and dates before the 20th century are approximate. The English renderings of Vietnamese terms are the project author's own.
- **SVG drawings and the 3D model:** made for this project.
- **Screenshots** in `docs/screenshots/` were captured from the site itself and include the photos credited above.

<div align="center">

<br />

**Mời trà!** — *please, have some tea.*

</div>
