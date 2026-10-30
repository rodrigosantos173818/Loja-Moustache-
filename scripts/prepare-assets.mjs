import sharp from 'sharp';
import { access, mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const [hero, sheet] = process.argv.slice(2);
if (hero) await sharp(hero).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/images/editorial-hero.webp');
if (sheet) {
  const { width, height } = await sharp(sheet).metadata();
  const w = Math.floor(width / 2), h = Math.floor(height / 2);
  for (const [i, name] of ['camiseta', 'polo', 'camisa', 'jeans'].entries()) {
    const crop = sharp(sheet).extract({ left: (i % 2) * w, top: Math.floor(i / 2) * h, width: w, height: h });
    await crop.resize(800, 1000, { fit: 'cover', position: 'centre' }).webp({ quality: 88 }).toFile(`public/images/${name}.webp`);
  }
}
// Keep the supplied company logo when regenerating the favicon.
const iconSource = await access('public/images/tribus-men-logo-v2.png').then(() => 'public/images/tribus-men-logo-v2.png').catch(() => 'public/icon.svg');
const png = await sharp(iconSource).resize(32, 32, { fit: 'contain' }).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico[6] = 32; ico[7] = 32;
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14); ico.writeUInt32LE(22, 18);
await writeFile('src/app/favicon.ico', Buffer.concat([ico, png]));
console.log('Editorial assets optimized.');
