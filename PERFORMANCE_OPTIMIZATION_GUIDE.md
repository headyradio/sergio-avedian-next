# Performance Optimization Guide

This guide documents all performance optimizations implemented for the Sergio Avedian website.

## JavaScript Optimizations

### 1. Module Script with Async
- **Implementation**: `<script type="module" src="/src/main.tsx" async></script>`
- **Benefit**: Module scripts are deferred by default, but adding `async` allows parallel downloading
- **Impact**: Non-blocking JavaScript execution, faster initial render

### 2. Code Splitting Strategy
Implemented manual chunk splitting in `vite.config.ts` to optimize caching:

```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
  'supabase': ['@supabase/supabase-js'],
  'editor': ['@tiptap/react', '@tiptap/starter-kit'],
}
```

**Benefits**:
- Vendor code cached separately from app code
- Smaller initial bundle size
- Faster subsequent page loads
- Better browser caching efficiency

### 3. Tree Shaking & Minification
- **esbuild minification** with console removal in production
- **Dead code elimination** for unused exports
- **CSS code splitting** enabled for route-based loading

### 4. Layout Thrashing Prevention
Implemented RAF (requestAnimationFrame) batching to prevent forced reflows:

**Key Optimizations**:
- **RAF throttling utility** (`src/lib/rafUtils.ts`) batches layout reads per frame
- **Layout value caching** reduces repeated DOM queries
- **Separate reads from writes** prevents layout thrashing
- **Passive scroll listeners** allows browser optimizations

**Files Optimized**:
- `ScrollProgressIndicator.tsx`: Cached document dimensions, RAF-throttled scroll handler
- `useScrollTrigger.ts`: Cached content layout values, RAF-throttled calculations

**Performance Impact**:
- Eliminates forced synchronous layouts during scroll
- Reduces main thread blocking during interactions
- Improves scroll smoothness and responsiveness
- Prevents layout recalculations on every scroll event

## CSS Optimizations

### 1. Critical CSS Inlining
Inlined essential CSS in `<head>` to prevent FOUC (Flash of Unstyled Content):

```css
/* Critical styles for initial render */
:root { --background: 220 25% 4%; --foreground: 0 0% 97%; }
body { background-color: hsl(220 25% 4%); color: hsl(0 0% 97%); }
```

**Benefits**:
- Eliminates render-blocking CSS for above-the-fold content
- Faster First Contentful Paint (FCP)
- Reduces Cumulative Layout Shift (CLS)

### 2. Font Loading Optimization
Moved font loading from CSS `@import` to HTML with async loading:

```html
<link 
  rel="preload" 
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
  href="https://fonts.googleapis.com/css2?family=Inter..."
/>
```

**Benefits**:
- Non-blocking font loading
- Prevents FOIT (Flash of Invisible Text)
- `display=swap` ensures text is visible during font load
- Faster LCP (Largest Contentful Paint)

### 3. CSS Code Splitting
- Enabled in Vite config: `cssCodeSplit: true`
- CSS loaded only for active routes
- Reduces initial CSS payload

## Resource Loading Optimizations

### 1. Resource Hints

**Preconnect** - Establishes early connections to critical origins:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://fkafzarnschmdbxevicb.supabase.co" />
```

**DNS Prefetch** - Resolves DNS earlier:
```html
<link rel="dns-prefetch" href="https://fkafzarnschmdbxevicb.supabase.co" />
```

### 2. LCP Image Preloading
```html
<link rel="preload" as="image" href="/src/assets/sergio-hero-main.png" fetchpriority="high" />
```

**Benefits**:
- Loads hero image before parser discovers it
- Significantly improves LCP timing
- Uses `fetchpriority="high"` for browser prioritization

### 3. Request Waterfall Optimization

**Before**:
1. HTML loads
2. CSS discovered and loaded (blocking)
3. Font @import discovered in CSS (blocking)
4. JavaScript loads after CSS
5. Images load after JS execution

**After**:
1. HTML loads with inlined critical CSS
2. Font preload starts immediately (parallel)
3. LCP image preload starts immediately (parallel)
4. Main JavaScript loads asynchronously (parallel)
5. Non-critical CSS loads asynchronously
6. Supabase connection established early via preconnect

## Performance Metrics Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

### Additional Metrics
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.5s
- **Speed Index**: < 3.0s

## Build Configuration

### Optimization Settings
```javascript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,      // Remove console.logs in production
      drop_debugger: true,     // Remove debugger statements
    },
  },
  chunkSizeWarningLimit: 1000,
  cssCodeSplit: true,
}
```

### Dependency Pre-bundling
```javascript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-router-dom',
    '@supabase/supabase-js',
    'date-fns',
  ],
}
```

## Testing & Validation

### Tools for Performance Testing
1. **Lighthouse** (Chrome DevTools)
   - Run audit in incognito mode
   - Test on mobile and desktop
   - Aim for 90+ performance score

2. **WebPageTest** (https://webpagetest.org)
   - Test from multiple locations
   - Check waterfall chart
   - Verify resource loading order

3. **Chrome DevTools**
   - Network tab: Check request waterfall
   - Performance tab: Record page load
   - Coverage tab: Check unused CSS/JS

### Validation Checklist
- [ ] No render-blocking resources in critical path
- [ ] Fonts load asynchronously with `display=swap`
- [ ] LCP image preloaded
- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] JavaScript executes asynchronously
- [ ] Vendor chunks cached separately
- [ ] No console.logs in production build

## Current Status

✅ JavaScript loading optimized (async modules, code splitting)
✅ Critical CSS inlined for above-the-fold content
✅ Font loading optimized (async with display=swap)
✅ Resource hints added (preconnect, dns-prefetch)
✅ LCP image preloaded
✅ Build configuration optimized
✅ Chunk splitting strategy implemented

## Monitoring

### Production Monitoring
- Use Real User Monitoring (RUM) tools like:
  - Google Analytics 4 (Web Vitals)
  - Cloudflare Web Analytics
  - Vercel Analytics

### Continuous Testing
- Run Lighthouse CI in deployment pipeline
- Monitor Core Web Vitals in Google Search Console
- Set up alerts for performance regressions

## Future Optimizations

Potential improvements for even better performance:

1. **HTTP/2 Server Push** for critical resources
2. **Service Worker** for offline caching
3. **Progressive Web App (PWA)** capabilities
4. **Edge caching** via Cloudflare Workers
5. **Image CDN** for automatic optimization
6. **Prefetching** for likely next-page navigations
7. **React Server Components** (requires framework migration)

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Font Loading Best Practices](https://web.dev/font-best-practices/)
