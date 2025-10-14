/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                interRegular: ["Inter_400Regular"],
                interSemiBold: ["Inter_600SemiBold"],
                interBold: ["Inter_700Bold"],
            },
            backgroundColor: {
                primary: "#FFAC1C",
            },
            colors: {
                link: "#4294EB",
                primary: "#FFAC1C",
            },
        },
    },
    plugins: [],
};