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
    public findFile(start: string) { return Object.keys(this.files).find(real => real.startsWith(start))};
};

const Cache = await new CacheManager().build();


export default function staticFiles(app: Elysia) { return app
    .get("/static/*", async ({ params, headers }) => {
        const raw = params["*"];
        if (!raw.includes("..")) {
            if (Cache.isFresh(headers["if-none-match"])) { return new Response(null, { status: 304 })};
            const compressed = raw.match(/(css|js)/)?.[0];
            const cached = `${compressed ? "compressed/" : ""}${raw}${compressed ? ".br" : ""}`;
            const real = raw.split(".").length < 2 ? Cache.findFile(raw) : cached;
            if (!real) { return new Response(null, { status: 404 })};
            const file = Bun.file(`${pdir}/${real}`);
            return await file.exists() ? new Response(file, { headers: {
                "Content-Type": MIMETYPES[raw.split(".").at(-1)!],
                ...compressed ? { "Content-Encoding": "br" } : {},
                "Cache-Control": "no-cache",
                "ETag": Cache.getEtag(real)
            }}) : new Response(null, { status: 404 });
        } else { return new Response(null, { status: 403 })};
    });
};