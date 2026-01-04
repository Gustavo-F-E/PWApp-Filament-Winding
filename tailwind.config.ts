import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    50: "var(--blue-50)",
                    100: "var(--blue-100)",
                    200: "var(--blue-200)",
                    300: "var(--blue-300)",
                    400: "var(--blue-400)",
                    500: "var(--blue-500)",
                    600: "var(--blue-600)",
                    700: "var(--blue-700)",
                    800: "var(--blue-800)",
                    900: "var(--blue-900)",
                    950: "var(--blue-950)",
                },
                white: {
                    50: "var(--white-50)",
                    100: "var(--white-100)",
                    200: "var(--white-200)",
                    300: "var(--white-300)",
                    400: "var(--white-400)",
                    500: "var(--white-500)",
                    600: "var(--white-600)",
                    700: "var(--white-700)",
                    800: "var(--white-800)",
                    900: "var(--white-900)",
                    950: "var(--white-950)",
                },
                red: {
                    50: "var(--red-50)",
                    100: "var(--red-100)",
                    200: "var(--red-200)",
                    300: "var(--red-300)",
                    400: "var(--red-400)",
                    500: "var(--red-500)",
                    600: "var(--red-600)",
                    700: "var(--red-700)",
                    800: "var(--red-800)",
                    900: "var(--red-900)",
                    950: "var(--red-950)",
                },
            },
            fontSize: {
                "fluid-xs": "clamp(0.75rem, 1.2vw, 0.875rem)", // 12-14px
                "fluid-sm": "clamp(0.8125rem, 1.4vw, 0.9375rem)", // 13-15px
                "fluid-base": "clamp(0.875rem, 1.6vw, 1rem)", // 14-16px (más pequeño)
                "fluid-lg": "clamp(1rem, 1.8vw, 1.125rem)", // 16-18px
                "fluid-xl": "clamp(1.125rem, 2.2vw, 1.375rem)", // 18-22px
                "fluid-2xl": "clamp(1.25rem, 2.6vw, 1.625rem)", // 20-26px
                "fluid-3xl": "clamp(1.5rem, 3.2vw, 2rem)", // 24-32px
                "fluid-4xl": "clamp(1.75rem, 4vw, 2.5rem)", // 28-40px
                "fluid-5xl": "clamp(2rem, 5vw, 3rem)", // 32-48px
                "fluid-6xl": "clamp(2.5rem, 6vw, 4rem)", // 40-64px
            },
        },
    },
    plugins: [],
};
export default config;
