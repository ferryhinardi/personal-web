#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

/**
 * Generate Open Graph image (1200x630 recommended size)
 * This creates a professional card with profile pic and text
 */
async function generateOGImage() {
  try {
    console.log('📸 Generating Open Graph image...\n');

    const inputImage = join(publicDir, 'images', 'profilepic.jpg');
    const outputImage = join(publicDir, 'images', 'og-image.jpg');

    // Create a simple OG image by resizing the profile pic
    // In a real scenario, you'd want to create a custom card with text overlay
    await sharp(inputImage)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90,
        progressive: true
      })
      .toFile(outputImage);

    console.log('✅ Open Graph image generated successfully!');
    console.log(`   Output: ${outputImage}`);
    console.log(`   Size: 1200x630px\n`);

    // Also create WebP version for better performance
    const outputImageWebP = join(publicDir, 'images', 'og-image.webp');
    await sharp(inputImage)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 85
      })
      .toFile(outputImageWebP);

    console.log('✅ WebP version also created!');
    console.log(`   Output: ${outputImageWebP}\n`);

  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
