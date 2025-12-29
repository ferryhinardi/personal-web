#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format and creates responsive versions
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public/images');
const portfolioDir = path.join(imagesDir, 'portfolio');

// Quality settings
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 85;

// Responsive sizes for different viewports
const SIZES = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
};

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { width, quality = WEBP_QUALITY, format = 'webp' } = options;
    
    let pipeline = sharp(inputPath);
    
    // Get original metadata
    const metadata = await pipeline.metadata();
    console.log(`  Original: ${metadata.width}x${metadata.height} (${metadata.format})`);
    
    // Resize if width specified and smaller than original
    if (width && width < metadata.width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    // Convert to specified format
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true });
    } else if (format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 9 });
    }
    
    await pipeline.toFile(outputPath);
    
    const stats = await fs.stat(outputPath);
    const originalStats = await fs.stat(inputPath);
    const savedBytes = originalStats.size - stats.size;
    const savedPercent = ((savedBytes / originalStats.size) * 100).toFixed(1);
    
    console.log(`  ✓ Saved: ${outputPath}`);
    console.log(`    Size: ${(stats.size / 1024).toFixed(1)}KB (${savedPercent}% smaller)\n`);
    
    return stats.size;
  } catch (error) {
    console.error(`  ✗ Error optimizing ${inputPath}:`, error.message);
    return 0;
  }
}

async function processImage(imagePath, outputDir) {
  const ext = path.extname(imagePath);
  const basename = path.basename(imagePath, ext);
  const relativePath = path.relative(imagesDir, imagePath);
  
  console.log(`\n📸 Processing: ${relativePath}`);
  
  const results = {
    original: (await fs.stat(imagePath)).size,
    optimized: 0,
  };
  
  // Create WebP version
  const webpPath = path.join(outputDir, `${basename}.webp`);
  results.optimized += await optimizeImage(imagePath, webpPath, {
    format: 'webp',
    quality: WEBP_QUALITY,
  });
  
  // Create responsive versions for large images
  const metadata = await sharp(imagePath).metadata();
  if (metadata.width > 1024) {
    // Mobile version
    const mobileWebpPath = path.join(outputDir, `${basename}-mobile.webp`);
    results.optimized += await optimizeImage(imagePath, mobileWebpPath, {
      width: SIZES.mobile,
      format: 'webp',
      quality: WEBP_QUALITY,
    });
    
    // Tablet version
    const tabletWebpPath = path.join(outputDir, `${basename}-tablet.webp`);
    results.optimized += await optimizeImage(imagePath, tabletWebpPath, {
      width: SIZES.tablet,
      format: 'webp',
      quality: WEBP_QUALITY,
    });
  }
  
  return results;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  // Process main images
  const mainImages = [
    'profilepic.jpg',
    'header-background1.jpg',
    'testimonials-bg.jpg',
  ];
  
  for (const image of mainImages) {
    const imagePath = path.join(imagesDir, image);
    try {
      await fs.access(imagePath);
      const results = await processImage(imagePath, imagesDir);
      totalOriginal += results.original;
      totalOptimized += results.optimized;
    } catch (error) {
      console.log(`  ⚠️  Skipping ${image} (not found)`);
    }
  }
  
  // Process portfolio images
  console.log('\n📁 Processing portfolio images...');
  try {
    const portfolioFiles = await fs.readdir(portfolioDir);
    const imageFiles = portfolioFiles.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );
    
    for (const file of imageFiles) {
      const imagePath = path.join(portfolioDir, file);
      const results = await processImage(imagePath, portfolioDir);
      totalOriginal += results.original;
      totalOptimized += results.optimized;
    }
  } catch (error) {
    console.log('  ⚠️  Portfolio directory not accessible');
  }
  
  // Summary
  const totalSaved = totalOriginal - totalOptimized;
  const percentSaved = ((totalSaved / totalOriginal) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Image Optimization Complete!\n');
  console.log(`📊 Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Total optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${percentSaved}%)`);
  console.log('='.repeat(60) + '\n');
  
  console.log('📝 Next steps:');
  console.log('1. Update components to use .webp images');
  console.log('2. Add <picture> element with fallbacks');
  console.log('3. Test the optimized images');
  console.log('4. Commit the changes\n');
}

main().catch(console.error);
