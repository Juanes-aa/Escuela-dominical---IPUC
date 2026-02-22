/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ipuc: {
          blue:   "#009FDA",   // Azul Cyan oficial
          navy:   "#003DA5",   // Azul Oscuro oficial
          yellow: "#F0AB00",   // Amarillo Dorado oficial
          dark:   "#001F5B",   // Azul muy oscuro (sidebar)
          light:  "#F0F7FF",   // Fondo azul muy claro
          mid:    "#D6EEFA",   // Azul claro para cards
        },
      },
    },
  },
  plugins: [],
}
