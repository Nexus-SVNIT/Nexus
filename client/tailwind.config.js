/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                dark_primary: "rgba(9, 8, 8, 0.69)",

                orange: "#D47D4A",
            },
            animation: {
                blob: "blob 4s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px,0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px,-50px) scale(1.2)",
                    },
                    "66%": {
                        transform: " translate(-20px,20px) scale(0.8)",
                    },
                    "100%": {
                        transform: "translate(0px,0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [],
};
