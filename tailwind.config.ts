import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    content: [
        "./templates/**/*.tsx"
    ], // All the src files with tailwind classes
    theme: {
        extend: {
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