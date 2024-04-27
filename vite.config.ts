import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 可以通过别名导入 ethers.js，以避免直接引用 node_modules 中的路径
      'ethers': 'ethers/dist/ethers.esm.min.js',
    },
  },
})
