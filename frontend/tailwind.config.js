/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-slow': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-200% 0',
          },
          '100%': {
            'background-position': '200% 0',
          },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 0, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes:[
      { mytheme: {
          
      "primary": "#dc2626",
                
      "secondary": "#dc2626",
                
      "accent": "#dc2626",
                
      "neutral": "#ff00ff",
                
      "base-100": "#ffffff",
                
      "info": "#2563eb",
                
      "success": "#22c55e",
                
      "warning": "#f87171",
                
      "error": "#ff0000",
                },},],
  }
}