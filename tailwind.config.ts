import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                reveal: {
                    "0%": {
                        transform: "translateY(100%)",
                    },
                    "100%": {
                        transform: "translateY(0%)",
                    },
                },
                grow: {
                    "0%": {
                        height: "0px",
                    },
                    "100%": {
                        height: "650px",
                    },
                },
                load: {
                    "0%": {
                        width: "0%",
                    },
                    "100%": {
                        width: "100%",
                    },
                },
            },
            animation: {
                grow: "grow 1.75s ease-in-out forwards",
                reveal: "reveal 1s ease-in-out forwards",
                load: "load 1.5s ease-in-out 0.75s forwards",
            },
        },
    },
    plugins: [],
};
export default config;
