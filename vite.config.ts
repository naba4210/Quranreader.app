import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is crucial for GitHub Pages deployment.
  // It ensures assets are loaded from /Quranreader.app/ instead of the root domain.
  base: '/Quranreader.app/',
});