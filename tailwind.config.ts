import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    content: [
        "./templates/**/*.tsx"
    ], // All the src files with tailwind classes
    theme: {
        extend: {
            boxShadow: {
                glow: "0 0 12px 3px #FF9B2B, 0 25px 50px -12px #A3A3A3"
            },
        },
    },
    plugins: [
        require("tailwind-children"),
        plugin(({ matchUtilities, theme }) => {
            matchUtilities({
                'text-shadow': v => ({ textShadow: v })
            }, { values: theme('textShadow')})
        })
    ]
} satisfies Config;