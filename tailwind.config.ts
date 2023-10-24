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
                fade: {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "100",
                    },
                },
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
                layer1: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "25%": {
                        transform: "rotate(60deg)",
                    },
                    "75%": {
                        transform: "rotate(-20deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer2: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "25%": {
                        transform: "rotate(-30deg)",
                    },
                    "75%": {
                        transform: "rotate(20deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer3: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "40%": {
                        transform: "rotate(30deg)",
                    },
                    "60%": {
                        transform: "rotate(100deg)",
                    },
                    "9%": {
                        transform: "rotate(-15deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer4: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "40%": {
                        transform: "rotate(-30deg)",
                    },
                    "60%": {
                        transform: "rotate(-100deg)",
                    },
                    "9%": {
                        transform: "rotate(15deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer5: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "30%": {
                        transform: "rotate(35deg)",
                    },
                    "50%": {
                        transform: "rotate(20deg)",
                    },
                    "75%": {
                        transform: "rotate(-20deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer6: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "30%": {
                        transform: "rotate(-20deg)",
                    },
                    "50%": {
                        transform: "rotate(90deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer7: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "100%": {
                        transform: "rotate(-360deg)",
                    },
                },
                layer8: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "65%": {
                        transform: "rotate(-80deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer9: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "55%": {
                        transform: "rotate(90deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
                layer10: {
                    "0%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "3.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "5%": {
                        transform: "scale(.8) translate(-35px,0)",
                    },
                    "11%": {
                        transform: "scale(.8) translate(-35px,0)",
                    },
                    "12.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "13%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "14%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "15%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "16.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "18%": {
                        transform: "scale(.8) translate(28px,28px)",
                    },
                    "22%": {
                        transform: "scale(.8) translate(28px,28px)",
                    },
                    "23%": {
                        transform: "scale(.8) translate(28px,-28px)",
                    },
                    "25%": {
                        transform: "scale(.8) translate(28px,-28px)",
                    },
                    "27%": {
                        transform: "scale(.8) translate(28px,-28px)",
                    },
                    "28%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "30%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "35%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "38%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "40%": {
                        transform: "scale(.8) translate(0,35px)",
                    },
                    "45%": {
                        transform: "scale(.8) translate(0,35px)",
                    },
                    "47%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "48%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "49%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "50%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "53.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "55%": {
                        transform: "scale(.8) translate(35px,0)",
                    },
                    "61%": {
                        transform: "scale(.8) translate(35px,0)",
                    },
                    "62.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "63%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "64%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "65%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "66.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "68%": {
                        transform: "scale(.8) translate(-28px,-28px)",
                    },
                    "72%": {
                        transform: "scale(.8) translate(-28px,-28px)",
                    },
                    "73%": {
                        transform: "scale(.8) translate(-28px,28px)",
                    },
                    "75%": {
                        transform: "scale(.8) translate(-28px,28px)",
                    },
                    "77%": {
                        transform: "scale(.8) translate(-28px,28px)",
                    },
                    "78%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "80%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "85%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "88%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "90%": {
                        transform: "scale(.8) translate(0,-35px)",
                    },
                    "95%": {
                        transform: "scale(.8) translate(0,-35px)",
                    },
                    "97%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "98%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "99%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "100%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                },
                pupil: {
                    "0%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "3.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "5%": {
                        transform: "scale(.8) translate(-50px,0)",
                    },
                    "11%": {
                        transform: "scale(.8) translate(-50px,0)",
                    },
                    "12.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "13%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "14%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "15%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "16.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "18%": {
                        transform: "scale(.8) translate(45px,45px)",
                    },
                    "22%": {
                        transform: "scale(.8) translate(45px,45px)",
                    },
                    "23%": {
                        transform: "scale(.8) translate(45px,-45px)",
                    },
                    "25%": {
                        transform: "scale(.8) translate(45px,-45px)",
                    },
                    "27%": {
                        transform: "scale(.8) translate(45px,-45px)",
                    },
                    "28%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "30%": {
                        transform: "scale(1.25) translate(0,0)",
                    },
                    "35%": {
                        transform: "scale(1.25) translate(0,0)",
                    },
                    "38%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "40%": {
                        transform: "scale(.8) translate(0,55px)",
                    },
                    "45%": {
                        transform: "scale(.8) translate(0,55px)",
                    },
                    "47%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "48%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "49%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "50%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "53.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "55%": {
                        transform: "scale(.8) translate(50px,0)",
                    },
                    "61%": {
                        transform: "scale(.8) translate(50px,0)",
                    },
                    "62.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "63%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "64%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "65%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "66.5%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "68%": {
                        transform: "scale(.8) translate(-45px,-45px)",
                    },
                    "72%": {
                        transform: "scale(.8) translate(-45px,-45px)",
                    },
                    "73%": {
                        transform: "scale(.8) translate(-45px,45px)",
                    },
                    "75%": {
                        transform: "scale(.8) translate(-45px,45px)",
                    },
                    "77%": {
                        transform: "scale(.8) translate(-45px,45px)",
                    },
                    "78%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "80%": {
                        transform: "scale(1.25) translate(0,0)",
                    },
                    "85%": {
                        transform: "scale(1.25) translate(0,0)",
                    },
                    "88%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "90%": {
                        transform: "scale(.8) translate(0,-55px)",
                    },
                    "95%": {
                        transform: "scale(.8) translate(0,-55px)",
                    },
                    "97%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "98%": {
                        transform: "scale(0) translate(0,0)",
                    },
                    "99%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                    "100%": {
                        transform: "scale(.8) translate(0,0)",
                    },
                },
                layer11: {
                    "0%": {
                        transform: "rotate(0)",
                    },
                    "50%": {
                        transform: "rotate(-60deg)",
                    },
                    "100%": {
                        transform: "rotate(0)",
                    },
                },
            },
            animation: {
                fade: "fade 1.5s ease-in-out forwards",
                grow: "grow 1.75s ease-in-out forwards",
                reveal: "reveal 1s ease-in-out forwards",
                load: "load 1.5s ease-in-out 0.75s forwards",
                layer1: "layer1 10s ease-in-out 0.75s infinite",
                layer2: "layer2 10s ease-in-out 0.75s infinite",
                layer3: "layer3 10s ease-in-out 0.75s infinite",
                layer4: "layer4 10s ease-in-out 0.75s infinite",
                layer5: "layer5 10s ease-in-out 0.75s infinite",
                layer6: "layer6 10s ease-in-out 0.75s infinite",
                layer7: "layer7 40s linear 0.75s infinite",
                layer8: "layer8 10s ease-in-out 0.75s infinite",
                layer9: "layer9 10s ease-in-out 0.75s infinite",
                layer10: "layer10 15s ease-in-out 0.75s infinite",
                pupil: "pupil 15s ease-in-out 0.75s infinite",
                layer11: "layer11 10s ease-in-out 0.75s infinite",
            },
        },
    },
    plugins: [],
};
export default config;
