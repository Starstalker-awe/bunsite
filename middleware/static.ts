import type Elysia from "elysia";

type file = {
    path: string,
    hash: number,
    compressed: boolean,
    type: typeof MIMETYPES[keyof typeof MIMETYPES]
};

const MIMETYPES: {[key: string]: string} = {
    js: "text/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    txt: "text/plain",
    pdf: "application/pdf",
    ico: "image/x-icon"
} as const;

const pdir = `${import.meta.dir}/../public/`;

class CacheManager {
    private files: {[name: string]: file} = {};
    private etags: string[] = [];

    public async build() {
        await Promise.all([...new Bun.Glob(`**/*{${Object.keys(MIMETYPES).join(",")}}`).scanSync(pdir)].map(async file => {
            const compressed = Boolean(file.match(/(css|js)/)?.[0]);
            const path = `${pdir}${compressed ? "compressed/" : ""}${file}${compressed ? ".br" : ""}`
            const content = await Bun.file(path).arrayBuffer();
            this.etags.push(new Bun.SHA256().update(content).digest("hex"));
            return this.files[file.split(".")[0]] = { path, hash: this.etags.length - 1, type: file.split(".").at(-1)!, compressed };
        }));
        return this;
    };
    
    public isFresh(etag: string | undefined): boolean { return Boolean(this.etags.includes(etag ?? ""))};
    public findFile(name: string): Omit<file, "hash"> & { hash: string } | false {
        const file = this.files[name.split(".")[0]];
        return file ? { ...file, hash: this.etags[file.hash]} : false;
    };
};

const Cache = await new CacheManager().build();


export default function staticFiles(app: Elysia) { return app
    .get("/static/*", async ({ params, headers }) => {
        if (Cache.isFresh(headers["if-none-match"])) return new Response(null, { status: 304 });
        const info = Cache.findFile(params["*"]);
        if (info) {
            const file = Bun.file(info.path);
            return new Response(file, { headers: {
                "Content-Type": MIMETYPES[info.type],
                "Content-Encoding": info.compressed ? "br" : "",
                "Cache-Control": "no-cache",
                "Etag": info.hash
            }});
        } else { return new Response(null, { status: 404 })};        
    })
};