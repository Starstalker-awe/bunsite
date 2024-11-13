import { brotliCompressSync, constants } from "node:zlib";
import { default as postcss } from "postcss";
import { unlinkSync } from "node:fs";
import log from "logging";

const publicdir = `${import.meta.dir}/public`;

const bstart = performance.now();
try {
    [...new Bun.Glob("compressed/**/*").scanSync(publicdir)].forEach(f => unlinkSync(`${publicdir}/${f}`));
} catch(e) {};
log(performance.now() - bstart, "Clear current build");

const tstart = performance.now();
const css = await Bun.file(`${import.meta.dir}/styles.css`).text();
const processed = await postcss([
    require("postcss-nested"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("cssnano")({
        preset: "advanced"
    })
]).process(css, { from: undefined, to: undefined });
await Bun.write(`${import.meta.dir}/public/styles.css`, processed.css);
log(performance.now() - tstart, "Build tailwind file");

const cstart = performance.now();
await Promise.all([...new Bun.Glob("**/*.{js,css}").scanSync(publicdir)].map(async file => {
    const content = await Bun.file(`${publicdir}/${file}`).text();
    const compressed = brotliCompressSync(content, { params: {
        [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
        [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY
    }});
    return await Bun.write(`${publicdir}/compressed/${file}.br`, compressed);
}));
log(performance.now() - cstart, "Compress files");

unlinkSync(`${import.meta.dir}/public/styles.css`);