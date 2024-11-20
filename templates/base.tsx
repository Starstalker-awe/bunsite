import { SITE_NAME, SITE_URL } from "../constants";
import type { Element } from "types";
import Header from "./header";
import Footer from "./footer";

export default function Base({ children, head, title, Menu, header, footer, meta }: {
    children?: Element,
    head?: Element,
    title: string,
    Menu: Element,
    header?: boolean,
    footer?: boolean,
    meta: {
        description: string,
        keywords: Array<string> | string,
        og?: {
            title: string,
            description: string,
            image: string,
            url: string
        }
    }
}) {
    return (
        <html lang="en-US">
            <head>
                <link rel="icon" href="/static/favicon.png" />
                <link rel="stylesheet" href="/static/styles.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={typeof meta.keywords === "string" ? meta.keywords : meta.keywords.join(", ")} />
                {meta.og && <>
                    <meta name="og:description" content={meta.og.description} />
                    <meta name="og:title" content={meta.og.title} />
                    <meta name="og:image" content={`http://${SITE_URL}/${meta.og.image}`} />
                    <meta name="og:url" content={`http://${SITE_URL}/${meta.og.url}`} />
                </>}
                <meta name="robots" content="index, follow" />
                <meta charset="UTF-8" />
                <title>{title} - {SITE_NAME}</title>
                {head}
            </head>
            <body>
                {(header ?? true) && <Header Menu={Menu} />}
                {children}
                {(footer ?? true) && <Footer Menu={Menu} />}
            </body>
            <script type="module">{`[...document.querySelectorAll("img")].forEach(image => image.draggable = false);`}</script>
        </html>
    );
};