/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                f1: {
                    red: '#E10600',
                    black: '#0B0B0B',
                    charcoal: '#222428',
                    offwhite: '#F6F5F3',
                    warmgray: '#9B9B9B',
                }
            },
            fontFamily: {
                racing: ['"Oswald"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
            }
        },
    },
    plugins: [],
}
