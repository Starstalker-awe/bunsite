import type { BlogEntry } from "types";
import Base from "./base";

export default function Blogs({ blogs }: { blogs: BlogEntry[]}) {
    return (
        <Base title="Blogs">
            <div class="bg-cover" style="background-image: url('/static/[IMG_URL]')"><div class="pt-32 xl:mx-32" /></div>

            <div class="lg:w-4/5 xl:my-24 lg:my-20 md:my-12 my-8 md:mx-auto mx-8">
                <h2 class="text-center xl:text-4xl lg:text-3xl md:text-2xl text-xl font-semibold">Featured Blogs</h2>
                <div class="blog-gallery mb-6">
                    {blogs.filter(blog => blog.featured).map(blog =>
                        <a href={`/blog/${blog.url}`} class="w-1/3">
                            <div class="blog-card">
                                <img src={`/static/blogs/${blog.url}`} loading="greedy" class="card-image" />
                                <h2 class="card-title">{blog.pretty}</h2>
                                <div class="mx-4 mb-4">{blog.content.split(" ").slice(0, 25).join(" ")}...</div>
                                <div class="mx-4 pb-4 font-semibold">Read more &rarr;</div>
                            </div>
                            <hr />
                        </a>
                    )}
                </div>

                <hr class="border-slate-600 w-2/3 m-auto border-2 rounded-xl md:mb-10" />

                <div class="blog-gallery flex-wrap">
                    {blogs.filter(blog => !blog.featured).map(blog =>
                        <a href={`/blog/${blog.url}`} class="w-1/4">
                            <div class="blog-card shadow-2xl shadow-neutral-400">
                                <img src={`/static/blogs/${blog.url}`} loading="lazy" class="card-image" />
                                <h2 class="card-title">{blog.pretty}</h2>
                                <div class="mx-4 pb-4 font-semibold">Read More &rarr;</div>
                            </div>
                        </a>
                    )}
                </div>
            </div>
        </Base>
    );
};