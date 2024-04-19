import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'

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
    // 开发环境配置
    port: 8090,
    open: false,
    proxy: {
      '/api': {
        target: 'https://nglottery.yb876.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // build: {
  //   // 生产部署配置
  //   outDir: 'dist/static', // 项目打包输出的路径
  //   assetsDir: 'static', // 静态资源存放的路径
  //   rollupOptions: {
  //     input: {
  //       main: resolve(__dirname, 'index.html') // 指定web入口
  //     }
  //   }
  // }
})
