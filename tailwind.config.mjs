/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#212325',
        'deep-black': '#0B1012',
        white: '#F1F1F1',
        beige: '#F3F0EC',
        taupe: '#D4CEC6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'], 
        mono: ['Space Mono', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
