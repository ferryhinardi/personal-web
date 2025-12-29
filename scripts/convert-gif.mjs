#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const inputPath = path.join(projectRoot, 'public/images/header-background.gif');

console.log('🎬 Converting GIF to static WebP images...\n');

// Desktop version
await sharp(inputPath, { pages: 1 })
  .webp({ quality: 80 })
  .toFile(path.join(projectRoot, 'public/images/header-background.webp'));
console.log('✓ Desktop version created');

// Mobile version
await sharp(inputPath, { pages: 1 })
  .resize(640, null, { withoutEnlargement: true, fit: 'inside' })
  .webp({ quality: 80 })
  .toFile(path.join(projectRoot, 'public/images/header-background-mobile.webp'));
console.log('✓ Mobile version created');

// Tablet version
await sharp(inputPath, { pages: 1 })
  .resize(1024, null, { withoutEnlargement: true, fit: 'inside' })
  .webp({ quality: 80 })
  .toFile(path.join(projectRoot, 'public/images/header-background-tablet.webp'));
console.log('✓ Tablet version created');

const originalStats = await fs.stat(inputPath);
const desktopStats = await fs.stat(path.join(projectRoot, 'public/images/header-background.webp'));
const mobileStats = await fs.stat(path.join(projectRoot, 'public/images/header-background-mobile.webp'));
const tabletStats = await fs.stat(path.join(projectRoot, 'public/images/header-background-tablet.webp'));

const totalSize = desktopStats.size + mobileStats.size + tabletStats.size;
const saved = originalStats.size - desktopStats.size; // Compare desktop versions
const savedPercent = ((saved / originalStats.size) * 100).toFixed(1);

console.log(`\n📊 Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`📦 Desktop WebP: ${(desktopStats.size / 1024).toFixed(1)} KB`);
console.log(`📱 Mobile WebP: ${(mobileStats.size / 1024).toFixed(1)} KB`);
console.log(`📱 Tablet WebP: ${(tabletStats.size / 1024).toFixed(1)} KB`);
console.log(`💾 Saved: ${(saved / 1024 / 1024).toFixed(2)} MB (${savedPercent}%)\n`);
console.log('✅ GIF conversion complete!');
