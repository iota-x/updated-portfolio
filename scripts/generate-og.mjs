// generates public/og.png (1200x630) from an inline SVG template
import sharp from "sharp";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="aurora" cx="75%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="55%" stop-color="#2e1065" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#080809" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#080809"/>
  <rect width="1200" height="630" fill="url(#aurora)"/>
  <!-- scattered stars -->
  <g fill="#cbacf9">
    <circle cx="140" cy="90" r="2" opacity="0.8"/>
    <circle cx="320" cy="180" r="1.5" opacity="0.5"/>
    <circle cx="540" cy="80" r="2" opacity="0.7"/>
    <circle cx="760" cy="150" r="1.5" opacity="0.5"/>
    <circle cx="1080" cy="320" r="2" opacity="0.7"/>
    <circle cx="920" cy="480" r="1.5" opacity="0.5"/>
    <circle cx="200" cy="470" r="2" opacity="0.6"/>
    <circle cx="640" cy="540" r="1.5" opacity="0.5"/>
  </g>
  <!-- north star -->
  <g>
    <path d="M1000 120 L1010 175 L1065 185 L1010 195 L1000 250 L990 195 L935 185 L990 175 Z" fill="#cbacf9"/>
    <circle cx="1000" cy="185" r="7" fill="#ffffff"/>
  </g>
  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">Ankit Pandey</text>
  <text x="90" y="400" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="400" fill="#cbacf9">I build software that feels alive</text>
  <text x="90" y="470" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="400" fill="#8a8797">Full-stack &amp; Web3 developer — Next.js, Solana, Three.js</text>
</svg>
`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og.png");
console.log("wrote public/og.png");
