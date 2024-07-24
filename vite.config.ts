import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default ({ mode }: { mode: 'development' | 'production' }) => {
  return defineConfig({
    plugins: [react()],
    build: {
      sourcemap: mode === 'development' ? 'inline' : false,
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
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://165.22.51.161:8081',
    //     },
    //   },
    // },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  });
};
