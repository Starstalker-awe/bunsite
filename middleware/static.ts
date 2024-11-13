import type Elysia from 'elysia';

const MIMETYPES: {[key: string]: string} = {
    js: "text/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    txt: "text/plain"
};

const pdir = `${import.meta.dir}/../public`;

class CacheManager {
    private files: {[name: string]: string} = {};
    
    public async build() {
        await Promise.all([...new Bun.Glob("**/*.{jpg,png,ico,br,webp}").scanSync(pdir)].map(async file => {
            const fpath = `${pdir}/${file}`;
            const content = await Bun.file(fpath).arrayBuffer();
            return this.files[file] = new Bun.SHA256().update(content).digest("base64");
        }));
        return this;
    };

    public getEtag(fname: string): string { return this.files[fname]! };
    public isFresh(etag: string | undefined): boolean { return Boolean(Object.keys(this.files).find(fname => this.files[fname] === etag))};
    public findFile(start: string) { return Object.keys(this.files).find(real => real.split(".")[0] === start.split(".")[0])};
};

const Cache = await new CacheManager().build();


export default function staticFiles(app: Elysia) { return app
    .get("/static/*", async ({ params, headers }) => {
        const raw = params["*"];
        if (!raw.includes("..")) {
            if (Cache.isFresh(headers["if-none-match"])) { return new Response(null, { status: 304 })};
            const compressed = raw.match(/(css|js)/)?.[0];
            const truedir = `${compressed ? "compressed/" : ""}${raw}${compressed ? ".br" : ""}`;
            const etag = Cache.findFile(truedir);
            if (!etag) { return new Response(null, { status: 404 })};
            const file = Bun.file(`${pdir}/${etag}`);
            return await file.exists() ? new Response(file, { headers: {
                "Content-Type": MIMETYPES[raw.split(".").at(-1)!],
                ...compressed ? { "Content-Encoding": "br" } : {},
                "Cache-Control": "no-cache",
                "ETag": Cache.getEtag(etag)
            }}) : new Response(null, { status: 404 });
        } else { return new Response(null, { status: 403 })};
    });
};