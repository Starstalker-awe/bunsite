import type { Element } from "types";

export default function Header({ Menu }: { Menu: Element }) {
    const icon_size = 60;
    return (
        <header class="bg-black xl:px-72 lg:px-32 md:px-32 px-10 py-6 bg-primary/40 border-b-2 border-primary/50 fixed top-50 right-0 left-0 flex justify-between items-center z-10" style="backdrop-filter: blur(5px)">
            {/* TODO: make header responsive; https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_responsive_navbar_dropdown */}
            <a href="/"><img src="/static/logo.png" width={icon_size} height={icon_size} /></a>
            <nav class="text-black child:lg:px-6 child:md:px-4 child:px-2 child:font-semibold hover:child:text-slate-600 child:duration-200">
                <Menu />
            </nav>
        </header>
    );
};