import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name].[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          } else {
            return `assets/[name].[hash][extname]`;
          }
        },
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }
          // Component chunks for code splitting
          if (id.includes('/components/ResourceDirectory')) {
            return 'resource-directory';
          }
          if (id.includes('/components/ResourceForm')) {
            return 'resource-form';
          }
          if (id.includes('/pages/Forum') || id.includes('/pages/ForumTopicDetail')) {
            return 'forum-pages';
          }
          if (id.includes('/pages/Blog') || id.includes('/pages/BlogDetail') || id.includes('/pages/WriteBlog')) {
            return 'blog-pages';
          }
          if (id.includes('/pages/Calendar')) {
            return 'calendar-page';
          }
        }
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
  resolve: {
    alias: {
      crypto: 'crypto',
    },
  },
  define: {
    global: 'globalThis',
  },
})
