module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sacramento: ['Sacramento', 'cursive'],
      },
      animation: {
        'item-1': 'fadeIn 0.3s ease-out 0s forwards',
        'item-2': 'fadeIn 0.3s ease-out 0.1s forwards',
        'item-3': 'fadeIn 0.3s ease-out 0.2s forwards',
        'item-4': 'fadeIn 0.3s ease-out 0.3s forwards',
        'item-5': 'fadeIn 0.3s ease-out 0.4s forwards',
        'item-1-reverse': 'fadeOut 0.3s ease-out 0.4s forwards',
        'item-2-reverse': 'fadeOut 0.3s ease-out 0.3s forwards',
        'item-3-reverse': 'fadeOut 0.3s ease-out 0.2s forwards',
        'item-4-reverse': 'fadeOut 0.3s ease-out 0.1s forwards',
        'item-5-reverse': 'fadeOut 0.3s ease-out 0s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0)' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-textshadow"),
  ],
}