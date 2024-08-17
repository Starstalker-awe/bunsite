import { SITE_NAME } from "../constants";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer class="xl:py-8 md:py-6 py-4 xl:px-32 lg:px-24 md:px-16 px-4 flex justify-between bg-zinc-100">
            <nav class="justify-evenly flex md:flex-row flex-col w-1/3 child:block child:font-semibold child:duration-300 text-primary hover:child:text-primary-dark">
                <a href="/">Home</a>
                <a href="/blog">Blog</a>
            </nav>
            <div class="justify-evenly flex w-1/3">
                &#169; {currentYear} {SITE_NAME}
            </div>
        </footer>
    );
};