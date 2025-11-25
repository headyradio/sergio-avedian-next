# Image Optimization Guide

This guide explains how to convert and optimize images for the Sergio Avedian website.

## Current Implementation

The site now supports modern image formats with automatic fallbacks:
- **AVIF**: Best compression (~50% smaller than JPEG)
- **WebP**: Good compression (~30% smaller than JPEG)
- **JPEG/PNG**: Fallback for older browsers

## Converting Images to WebP and AVIF

### Using Sharp (Recommended - Node.js)

Install Sharp:
```bash
npm install sharp
```

Create a conversion script `convert-images.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './src/assets';
const outputDir = './public/assets/optimized';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process all images
fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, ext);
    
    // Convert to WebP
    sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(outputDir, `${baseName}.webp`))
      .then(() => console.log(`✓ Created ${baseName}.webp`))
      .catch(err => console.error(`✗ Error creating WebP:`, err));
    
    // Convert to AVIF
    sharp(inputPath)
      .avif({ quality: 80, effort: 6 })
      .toFile(path.join(outputDir, `${baseName}.avif`))
      .then(() => console.log(`✓ Created ${baseName}.avif`))
      .catch(err => console.error(`✗ Error creating AVIF:`, err));
    
    // Optimize original
    if (ext === '.jpg' || ext === '.jpeg') {
      sharp(inputPath)
        .jpeg({ quality: 85, progressive: true })
        .toFile(path.join(outputDir, file))
        .then(() => console.log(`✓ Optimized ${file}`))
        .catch(err => console.error(`✗ Error optimizing:`, err));
    } else if (ext === '.png') {
      sharp(inputPath)
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(path.join(outputDir, file))
        .then(() => console.log(`✓ Optimized ${file}`))
        .catch(err => console.error(`✗ Error optimizing:`, err));
    }
  }
});
```

Run it:
```bash
node convert-images.js
```

### Using ImageMagick (Command Line)

Install ImageMagick:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows: Download from https://imagemagick.org/script/download.php
```

Convert individual images:
```bash
# Convert to WebP
magick input.jpg -quality 85 output.webp

# Convert to AVIF (requires libheif)
magick input.jpg -quality 80 output.avif

# Optimize JPEG
magick input.jpg -quality 85 -sampling-factor 4:2:0 -strip -interlace JPEG output.jpg
```

Batch convert all images:
```bash
# WebP
for file in *.{jpg,jpeg,png}; do magick "$file" -quality 85 "${file%.*}.webp"; done

# AVIF
for file in *.{jpg,jpeg,png}; do magick "$file" -quality 80 "${file%.*}.avif"; done
```

### Using Online Tools

**Squoosh** (Google): https://squoosh.app/
- Upload your image
- Choose WebP or AVIF format
- Adjust quality (80-85 recommended)
- Download optimized image

## Image Size Guidelines

### Hero Images (LCP - Largest Contentful Paint)
- **Original dimensions**: 1920x1200px max
- **JPEG quality**: 85%
- **WebP quality**: 85%
- **AVIF quality**: 80%
- **File size target**: < 300KB for JPEG, < 150KB for WebP, < 100KB for AVIF

### Blog Cover Images
- **Original dimensions**: 1200x630px
- **JPEG quality**: 85%
- **WebP quality**: 85%
- **AVIF quality**: 80%
- **File size target**: < 200KB for JPEG

### Logos and Icons
- **Original dimensions**: Varies (keep aspect ratio)
- **PNG quality**: 90% or lossless
- **WebP quality**: 90%
- **File size target**: < 50KB

## Responsive Images Setup

The `OptimizedImage` component now automatically handles:
- Modern format detection and fallback
- Lazy loading (except for priority images)
- Width/height attributes to prevent layout shifts
- Proper `srcset` and `sizes` attributes

### Usage Example

```tsx
<OptimizedImage
  src="/assets/hero-image.jpg"
  alt="Hero image description"
  width={1920}
  height={1200}
  priority={true}  // For LCP images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-lg"
/>
```

## Deployment Checklist

Before deploying optimized images:

1. **Convert all critical images** (hero images, featured content)
2. **Test in multiple browsers** (Chrome, Firefox, Safari, Edge)
3. **Verify fallbacks work** for older browsers
4. **Check file sizes** - ensure they meet targets
5. **Update preload links** in `index.html` for LCP images
6. **Test on slow connections** to verify lazy loading

## Performance Targets

After optimization, aim for:
- **LCP**: < 2.5 seconds
- **Total image weight** (above fold): < 500KB
- **WebP adoption**: > 90% of modern browsers
- **AVIF adoption**: > 70% of modern browsers

## Current Status

✅ Enhanced `OptimizedImage` component with modern format support
✅ Added width/height attributes to prevent layout shifts
✅ Implemented LCP preloading for hero image
✅ Added responsive image support (srcset, sizes)
✅ Configured lazy loading for non-critical images

⚠️ **Action Required**: Convert images to WebP and AVIF formats using the tools above

## Future Improvements

- [ ] Implement responsive image sizes (multiple resolutions)
- [ ] Add blur-up placeholder technique
- [ ] Use CDN with automatic format conversion
- [ ] Implement progressive image loading
