import { NotFoundError, t } from "elysia";
import type { BlogEntry } from "types";
import Blogs from "../templates/blogs";
import Blog from "../templates/blog";
import type Elysia from "elysia";
import log from "logging";

const converter = new (await import("showdown")).Converter({
    noHeaderId: true,
    parseImgDimensions: true,
    excludeTrailingPunctuationFromURLs: true,
    strikethrough: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: true,
    requireSpaceBeforeHeadingText: true,
    underline: true,
    headerLevelStart: 3
});

const bstart = performance.now();
const blogs: BlogEntry[] = [];
for (const file of new Bun.Glob("**/*.md").scanSync(`${import.meta.dir}/../blogs`)) {
    const name = file.slice(0, -3).split("/").at(-1)!.split("_");
    const url = name.filter(word => !word.match(/\.|\||\\|\?/g)).join("_");
    const pretty = name.map(word => `${word[0].toUpperCase()}${word.slice(1)}`).join(" ");
    const content = converter.makeHtml(await Bun.file(`${import.meta.dir}/../blogs/${file}`).text());
    blogs.push({ url, pretty, content, featured: file.includes("featured")});
};
const urls = blogs.map(entry => entry.url);
log(performance.now() - bstart, "Load blogs");

export const serveBlogs = (app: Elysia) => app
.get("/blog", () => <Blogs blogs={blogs} />)
.get("/blog/:blog", ({ params }) => {
    if (!urls.includes(params.blog)) { throw new NotFoundError()};
    return <Blog entry={blogs.find(entry => entry.url === params.blog)!} />;
}, { params: t.Object({ blog: t.String()})});