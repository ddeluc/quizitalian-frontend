/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "node_modules/preline/dist/*.js",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'geologica': ['Geologica', 'sans-serif'],
      },
      fontSize: {
        title: '2.6rem',
        paragraph: '1.2rem',
      },
      colors: {
        slate: {
          400: '#A5B6CF',
        },
        bittersweet: {
          50: '#ffedf0',
          100: '#ffd2d8',
          200: '#f27d7f',
          300: '#d65c5e',
        },
        sunglow: {
          50: '#fff7e4',
          100: '#ffeaba',
          200: '#ffdd8f',
          300: '#ebc160',
        },
        tropicalindigo: {
          50: '#eee7ff',
          100: '#d1c5fe',
          200: '#b29eff',
          300: '#8b75e0'
        },
        skyblue: {
          50: '#e2f5ff',
          100: '#b4e5ff',
          200: '#83d4ff',
          300: '#56aad6'
        },
        plum: {
          50: '#fbe6f8',
          100: '#f4c0ee',
          200: '#ed95e4',
          300: '#c967bf'
        },
        aquamarine: {
          50: '#dafcf4',
          100: '#a0f6e0',
          200: '#48f0cc',
          300: '#2dccaa'
        },
        papaya: {
          50: '#fff1db',
          100: '#fddcaa',
          200: '#f9c575',
          300: '#d19f52',
        },
      },
      height: {
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        'navbar': '8vh',
        'sansnavbar': '92vh',
        'sansnavbarfooter': '84vh',
        'footer': '8vh',
      },
      maxHeight: {
        'sansnavbar': '86vh',
      },
      width: {
        '1/20': '5%',
        '2/20': '10%',
        '3/20': '15%',
        '4/20': '20%',
        '5/20': '25%',
        '6/20': '30%',
        '7/20': '35%',
        '8/20': '40%',
        '9/20': '45%',
        '10/20': '50%',
        '11/20': '55%',
        '12/20': '60%',
        '13/20': '65%',
        '14/20': '70%',
        '15/20': '75%',
        '16/20': '80%',
        '17/20': '85%',
        '18/20': '90%',
        '19/20': '95%',
      },
      padding: {
        'py-4.5': '1.2rem',
      }
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}

