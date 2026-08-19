// Generates public/logo.png, public/og/nivelics-home.jpg, app/icon.png,
// app/apple-icon.png and app/favicon.ico from the nav wordmark PNG.
// Run from the nivelics-web repo root: node <this file> /tmp/nivelics-logo.png
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = process.argv[2] ?? "/tmp/nivelics-logo.png";

// 1. Tight-trimmed wordmark
const wordmark = await sharp(SRC).trim().toBuffer();
const wmMeta = await sharp(wordmark).metadata();
console.log("wordmark trimmed:", wmMeta.width, "x", wmMeta.height);

// 2. public/logo.png — wordmark on white, 1200px wide, 8% padding
{
  const scaled = await sharp(wordmark).resize({ width: 1104 }).toBuffer();
  const m = await sharp(scaled).metadata();
  await sharp({
    create: {
      width: 1200,
      height: m.height + 96,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: scaled, gravity: "center" }])
    .png()
    .toFile("public/logo.png");
  console.log("logo.png:", 1200, "x", m.height + 96);
}

// 3. N monogram — leftmost ~16% of the trimmed wordmark, re-trimmed
const nMono = await sharp(wordmark)
  .extract({ left: 0, top: 0, width: Math.round(wmMeta.width * 0.165), height: wmMeta.height })
  .trim()
  .toBuffer();
const nMeta = await sharp(nMono).metadata();
console.log("N monogram:", nMeta.width, "x", nMeta.height);

// Square white canvas with the N centered at ~76% of the side
async function iconPng(size) {
  const inner = Math.round(size * 0.76);
  const n = await sharp(nMono).resize({
    width: inner,
    height: inner,
    fit: "inside",
  }).toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: n, gravity: "center" }])
    .png()
    .toBuffer();
}

await sharp(await iconPng(512)).toFile("app/icon.png");
await sharp(await iconPng(180)).toFile("app/apple-icon.png");
console.log("icon.png (512) + apple-icon.png (180) written");

// 4. favicon.ico — PNG-compressed entries at 16/32/48
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await iconPng(s));

const count = sizes.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(count, 4);

const entries = [];
let offset = 6 + 16 * count;
for (let i = 0; i < count; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); // width
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // color planes
  e.writeUInt16LE(32, 6); // bpp
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(e);
}
writeFileSync("app/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
console.log("favicon.ico written:", 6 + 16 * count + pngs.reduce((a, b) => a + b.length, 0), "bytes");

// 5. OG image 1200×630 — white ground, wordmark centered, cyan + dark base bars
{
  const wm = await sharp(wordmark).resize({ width: 760 }).toBuffer();
  const m = await sharp(wm).metadata();
  const cyanBar = await sharp({
    create: { width: 1200, height: 14, channels: 4, background: "#29B8E5" },
  }).png().toBuffer();
  const darkBar = await sharp({
    create: { width: 1200, height: 10, channels: 4, background: "#3E4148" },
  }).png().toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([
      { input: wm, left: Math.round((1200 - m.width) / 2), top: Math.round((630 - m.height) / 2) - 20 },
      { input: darkBar, left: 0, top: 606 },
      { input: cyanBar, left: 0, top: 616 },
    ])
    .flatten({ background: "#FFFFFF" })
    .jpeg({ quality: 92 })
    .toFile("public/og/nivelics-home.jpg");
  console.log("og/nivelics-home.jpg written (1200x630)");
}
