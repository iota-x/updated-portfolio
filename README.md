# Portfolio

My personal portfolio — a WebGL-heavy, single-page site built to feel more like an interactive scene than a document.

**Live:** https://portfolio-eiota.vercel.app/

## Stack

- [Next.js 14](https://nextjs.org/) (app router, static export)
- [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + drei + postprocessing
- [Framer Motion](https://www.framer.com/motion/) for scroll-driven and layout animation
- [Lenis](https://lenis.darkroom.engineering/) smooth scrolling
- [webgl-fluid-enhanced](https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced) for the cursor smoke

## Notable details

- **Persistent WebGL scene** — a canvas layer (`SceneCanvas`) travels with you through the whole page instead of living inside one section.
- **Fluid cursor trail** — a real Navier-Stokes fluid sim drags violet smoke across the page on cursor move (desktop, fine-pointer only).
- **Liquid-ripple project cards** — screenshots render through a distortion shader that ripples from the cursor with chromatic splitting (`DistortImage`). Cards with a demo clip feed the playing `<video>` into the same shader as a live texture.
- **Adaptive quality** — `lib/quality.ts` samples real FPS after load and steps effects down (or off) on machines that can't hold frame rate, remembering the tier for the session. Demo videos only play while scrolled into view so they never eat the frame budget.
- **Entry sequence, section counter, sound effects** — small touches layered on top; reduced-motion users get everything in plain flow.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export to out/
npm run deploy     # vercel --prod
```

## Structure

```
app/            layout, page, global styles
components/     page sections (Hero, Grid, RecentProjects, Technologies, Approach, Footer)
components/ui/  effects and primitives (SceneCanvas, FluidTrail, DistortImage, CustomCursor, ...)
data/           all site content — projects, nav, testimonials — edited in one place
lib/            quality tiers, utils
scripts/        image optimization and OG-image generation
public/         static assets (webp screenshots, demo clips, icons)
```

Project content lives in `data/index.ts` — adding a project is one object; give it a `video` field and the card plays a looping demo instead of a static screenshot.
