/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        background: '#05050A', // Nachtblauw/zwart
        traces: '#8B5CF6',     // Zacht paars (accentkleur)
        text: '#F8FAFC',       // Helder zilver/wit voor hoge leesbaarheid
        accents: '#38BDF8'     // IJsblauw (actieve elementen)
      },
      fontFamily: {
        tech: [
          'JetBrains Mono',
          'IBM Plex Mono',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ],
        human: ['Inter', 'Avenir Next', 'system-ui', 'sans-serif']
      }
    }
  }
};