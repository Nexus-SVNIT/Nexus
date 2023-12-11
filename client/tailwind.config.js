/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                dark_primary: "rgba(9, 8, 8, 0.69)",

                orange: "#D47D4A",
            },
        },
    },
    plugins: [],
};
