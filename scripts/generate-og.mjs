// generates public/og.png (1200x630) from an inline SVG template.
// Right-side hero: the WalletChat iridescent glass bloom (a distilled
// GlassArtifact) — faceted kite blades in overlapping rings with a warm
// refractive core. No feTurbulence warp here: sharp's SVG rasterizer
// (librsvg/resvg) handles gradients + paths reliably but not displacement.
import sharp from "sharp";

// ── bloom geometry (ported from wallet-chat GlassArtifact) ───────────────────
const CX = 905, CY = 315;
function blade(ang, r0, r1, w) {
  const dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
  const mid = (r0 + r1) / 2;
  const p = (r) => `${(CX + dx * r).toFixed(1)} ${(CY + dy * r).toFixed(1)}`;
  const s = (sign) => `${(CX + dx * mid + px * w * sign).toFixed(1)} ${(CY + dy * mid + py * w * sign).toFixed(1)}`;
  return `M ${p(r0)} L ${s(1)} L ${p(r1)} L ${s(-1)} Z`;
}
function ring(count, r0, r1, w, offset = 0) {
  return Array.from({ length: count }).map((_, i) => {
    const ang = ((i + offset) / count) * Math.PI * 2;
    return { d: blade(ang, r0, r1, w), i, ang };
  });
}
const outer = ring(18, 70, 235, 22);
const mid = ring(22, 36, 150, 13, 0.5);
const inner = ring(14, 14, 78, 8, 0.25);

const bloom = `
  <ellipse cx="${CX}" cy="${CY}" rx="150" ry="132" fill="url(#core)"/>
  <g transform="translate(${CX} ${CY}) scale(1.18 0.92) rotate(-13) translate(${-CX} ${-CY})">
    ${outer.map(({ d, i }) => `<path d="${d}" fill="url(#iris)" fill-opacity="${i % 2 ? 0.42 : 0.55}" stroke="url(#iris)" stroke-opacity="0.8" stroke-width="1" stroke-linejoin="round"/>`).join("")}
    ${mid.map(({ d, i }) => `<path d="${d}" fill="url(#iris2)" fill-opacity="${i % 2 ? 0.5 : 0.62}" stroke="#fff" stroke-opacity="0.32" stroke-width="0.9" stroke-linejoin="round"/>`).join("")}
    ${inner.map(({ d }) => `<path d="${d}" fill="url(#iris)" fill-opacity="0.72" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" stroke-linejoin="round"/>`).join("")}
    ${outer.filter((_, i) => i % 5 === 0).map(({ ang }) => { const dx = Math.cos(ang), dy = Math.sin(ang); return `<line x1="${(CX + dx * 80).toFixed(1)}" y1="${(CY + dy * 80).toFixed(1)}" x2="${(CX + dx * 225).toFixed(1)}" y2="${(CY + dy * 225).toFixed(1)}" stroke="#fff" stroke-opacity="0.5" stroke-width="0.7"/>`; }).join("")}
  </g>
  <ellipse cx="855" cy="270" rx="180" ry="150" fill="url(#sheen)"/>`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="aurora" cx="75%" cy="24%" r="82%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.42"/>
      <stop offset="52%" stop-color="#2e1065" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#080809" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="iris" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#CDBEF4"/><stop offset="30%" stop-color="#8E97E8"/>
      <stop offset="58%" stop-color="#EBB2E4"/><stop offset="100%" stop-color="#E6A15C"/>
    </linearGradient>
    <linearGradient id="iris2" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E6A15C"/><stop offset="50%" stop-color="#C9BEEA"/><stop offset="100%" stop-color="#8E97E8"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="48%" r="52%">
      <stop offset="0%" stop-color="#FFE7C4" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#F4C089" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#B9A6EC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sheen" cx="38%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#080809"/>
  <rect width="1200" height="630" fill="url(#aurora)"/>
  <!-- scattered stars -->
  <g fill="#cbacf9">
    <circle cx="140" cy="90" r="2" opacity="0.8"/>
    <circle cx="320" cy="180" r="1.5" opacity="0.5"/>
    <circle cx="540" cy="80" r="2" opacity="0.7"/>
    <circle cx="200" cy="470" r="2" opacity="0.6"/>
    <circle cx="640" cy="560" r="1.5" opacity="0.45"/>
    <circle cx="1120" cy="520" r="1.5" opacity="0.5"/>
  </g>

  <!-- WalletChat iridescent glass bloom -->
  ${bloom}

  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">Ankit Pandey</text>
  <text x="90" y="400" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="400" fill="#cbacf9">I build software that feels alive</text>
  <text x="90" y="470" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="400" fill="#8a8797">Full-stack &amp; Web3 developer — Next.js, Solana, Three.js</text>
</svg>
`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og.png");
console.log("wrote public/og.png");
