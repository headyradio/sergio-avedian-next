import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Bundle analysis plugin for visualizing bundle composition
    mode === 'production' && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for debugging production issues
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI component libraries (Radix)
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Rich text editor
            if (id.includes('@tiptap')) {
              return 'editor';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            // Query library
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // Other node_modules go to vendor chunk
            return 'vendor';
          }
        },
      },
      // Tree-shaking optimizations
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
      },
    },
    // Increase chunk size warning limit for vendor bundles
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting for route-based loading
    cssCodeSplit: true,
    // Use esbuild for minification (faster than terser)
    minify: 'esbuild',
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none', // Remove comments to reduce bundle size
      treeShaking: true,
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
  // Optimize dependencies - pre-bundle commonly used packages
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'date-fns',
    ],
    // Exclude heavy packages that should be code-split
    exclude: ['@tiptap/react', '@tiptap/starter-kit'],
  },
}));
