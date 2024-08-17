export default function Header() {
    const icon_size = 60;
    return (
        <header class="xl:mx-72 lg:mx-32 md:mx-32 mx-10 my-8 bg-transparent absolute top-0 right-0 left-0 flex justify-between items-center">
            {/* TODO: make header responsive; https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_responsive_navbar_dropdown */}
            <a href="/"><img src="/static/logo.png" width={icon_size} height={icon_size} /></a>
            <nav class="text-white child:lg:px-6 child:md:px-4 child:px-2 child:font-semibold hover:child:text-slate-400 child:duration-200">
                <a href="/">Home</a>
                <a href="/blog">Blog</a>
            </nav>
        </header>
    );
};