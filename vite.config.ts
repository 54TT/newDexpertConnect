import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'inline',
  },
  resolve: {
    alias: {
      // 可以通过别名导入 ethers.js，以避免直接引用 node_modules 中的路径
      // @ 替代为 src
      '@': resolve(__dirname, 'src'),
      // @component 替代为 src/component
      '@components': resolve(__dirname, 'src/components'),
      '@abis': resolve(__dirname, 'abis'),
      '@utils': resolve(__dirname, 'utils'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
