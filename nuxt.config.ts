import dotenv from 'dotenv';
import { defineNuxtConfig } from 'nuxt/config';
import checker from 'vite-plugin-checker';
import svgLoader from 'vite-svg-loader';

dotenv.config({ path: './.env' });

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/fontaine'],

  ssr: false,
  devtools: { enabled: false },

  app: {
    baseURL: './',
    buildAssetsDir: 'nuxt/',
    head: {
      title: 'To do list - Keep it simple',
      htmlAttrs: {
        lang: 'fr'
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' }
      ],
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, viewport-fit=cover'
        },
        { name: 'author', content: 'Yohan Quinquis' },
        { name: 'keywords', content: 'to do, todo, task, list, extension, chrome, firefox, simple' },
        { name: 'description', content: 'Just a simple to do list extension with a simple design.' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },

        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: '/' },
        { property: 'og:title', content: 'To do list - Keep it simple' },
        { property: 'og:description', content: 'Just a simple to do list extension with a simple design.' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: '/' },
        { name: 'twitter:title', content: 'To do list - Keep it simple' },
        { name: 'twitter:description', content: 'Just a simple to do list extension with a simple design.' },
        { name: 'apple-mobile-web-app-title', content: 'To do list - Keep it simple' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ]
    }
  },

  css: ['./assets/scss/main.scss'],

  rootDir: './',

  routeRules: {
    '/': { prerender: true, headers: { 'cache-control': 'public, max-age=600' } },
    '/api/**': { cors: true }
  },

  features: {
    inlineStyles: true // Inline critical CSS
  },

  experimental: {
    payloadExtraction: true, // Extract payload for better SSG
    componentIslands: true, // Better lazy loading
    viewTransition: false, // Native view transitions
    extractAsyncDataHandlers: true // Extract async data for better SSG
  },
  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'static',
    minify: true,
    compressPublicAssets: {
      brotli: true,
      gzip: true
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    }
  },

  vite: {
    server: {
      hmr: {
        overlay: false
      },
      fs: {
        strict: false,
        allow: ['.']
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.*/**', '**/dist/**', '**/.nuxt/**']
      }
    },
    optimizeDeps: {
      exclude: ['vue-demi'],
      include: ['vue', 'vue-router']
    },

    plugins: [
      ...(process.env.BUILD_PRESET !== 'prod'
        ? [
            checker({
              vueTsc: {
                tsconfigPath: 'tsconfig.json',
                root: '.'
              },
              enableBuild: false,
              overlay: false,
              terminal: true
            })
          ]
        : []),

      svgLoader({
        defaultImport: 'raw'
      })
    ],

    json: {
      stringify: true
    },

    build: {
      target: 'es2020',
      cssCodeSplit: true,
      cssMinify: true,
      ssrManifest: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // TODO SET BACK WHEN IN PROD
          drop_debugger: false
        }
      },
      commonjsOptions: { transformMixedEsModules: true }
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/variables" as *; @use "@/assets/scss/colors" as *; @use "@/assets/scss/eases" as *; @use "@/assets/scss/mixins" as *;`
        }
      }
    },

    vue: {
      template: {
        compilerOptions: {
          hoistStatic: true,
          whitespace: 'condense',
          cacheHandlers: true
        }
      },
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  postcss: {
    plugins: {
      autoprefixer: {},
      ...(process.env.BUILD_PRESET === 'prod' ? { cssnano: { preset: 'default' } } : {})
    }
  },

  eslint: {
    config: {
      stylistic: {
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      {
        name: 'sora',
        provider: 'local',
        src: ['./assets/fonts/sora.ttf'],
        weight: '100 900',
        style: 'normal',
        display: 'swap',
        preload: true
      }
    ]
  }
});
