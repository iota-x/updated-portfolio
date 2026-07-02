// converts heavyweight public images to WebP (run once, commit the output)
import sharp from "sharp";

const jobs = [
  // project screenshots
  { src: "public/pulsar.png", out: "public/pulsar.webp", width: 1600 },
  { src: "public/app-local.png", out: "public/app-local.webp", width: 1600 },
  { src: "public/nft-library.png", out: "public/nft-library.webp", width: 1600 },
  { src: "public/p2.png", out: "public/p2.webp", width: 1600 },
  { src: "public/p3.png", out: "public/p3.webp", width: 1600 },
  { src: "public/p4.png", out: "public/p4.webp", width: 1600 },
  // bento textures (giant SVGs rasterized)
  { src: "public/grid.svg", out: "public/grid.webp", width: 1200 },
  { src: "public/b5.svg", out: "public/b5.webp", width: 1000 },
];

for (const { src, out, width } of jobs) {
  const img = sharp(src).resize({ width, withoutEnlargement: true });
  await img.webp({ quality: 80 }).toFile(out);
  console.log("wrote", out);
}
