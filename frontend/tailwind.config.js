/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        commonblack: "var(--common-black)",
        commonblacktwo: "var(--common-black-two)",
        commonbackgroundtwo: "var(--common-backgroundtwo)",
        commonbackground: "var(--common-background)",
        commonsecondarybackdround: "rgba(var(--common-secondarybackdround))",
        commonwhite: "var( --common-white)",
        commonwhitetwo: "var(--common-white-two)",
        primary: "var(--theme-primary)",
        secondary: "var(--theme-secondary)",
      },
      
    },
  },
  plugins: [],
};
