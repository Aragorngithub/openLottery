import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname)
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 20 versions']
        }),
        pxtorem({
          rootValue: 14,
          propList: ['*']
        })
      ]
    }
  },
  base: './', // 打包路径
  server: {
    port: 8090,
    open: false,
    proxy: {
      '/api': {
        target: 'https://nglottery.yb876.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
