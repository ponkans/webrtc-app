import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // fix: tsconfig.json path 不生效
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
