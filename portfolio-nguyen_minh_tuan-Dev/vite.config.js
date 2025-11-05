import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 rất quan trọng: base phải đúng tên repo GitHub
export default defineConfig({
  plugins: [react()],
  base: '/portfolio-nguyen_minh_tuan-Dev/',
})
