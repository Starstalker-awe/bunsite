import type { BlogEntry } from "types";
import Base from "./base";

export default function Blog(entry: BlogEntry) {
    return (
        <Base title={entry.pretty}>
            <div class="h-[50vh] bg-center bg-cover text-center flex justify-center items-center" style={`background-image: linear-gradient(#00000020, #00000020), url('/static/blogs/${entry.url}')`}>
                <h1 class="xl:text-6xl lg:text-4xl text-2xl font-semibold text-white backdrop-blur-xl backdrop-brightness-75">{entry.pretty}</h1>
            </div>
            <div class="blog-content">
                {entry.content}
            </div>
        </Base>
    );
};