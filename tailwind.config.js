export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['Newsreader', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      // The homepage hero's scroll cue: a short tick sliding down a hairline.
      // Applied with motion-safe:, so reduced-motion users get a still line.
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(300%)', opacity: '0' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}