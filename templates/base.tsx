import { SITE_NAME } from "../constants";
import type { Element } from "types";
import Header from "./header";
import Footer from "./footer";

export default function Base({ children, head, header, footer, title }: {
    children?: Element,
    head?: Element,
    header?: boolean,
    footer?: boolean,
    title: string
}) {
    return (
        <html lang="en-US">
            <head>
                <link rel="icon" href="/static/favicon.png" />
                <link rel="stylesheet" href="/static/styles.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charset="UTF-8" />
                <title>{title} - {SITE_NAME}</title>
                {head}
            </head>
            <body>
                {(header ?? true) && <Header />}
                {children}
                {(footer ?? true) && <Footer />}
            </body>
            <script type="module">{`[...document.querySelectorAll("img")].forEach(image => image.draggable = false);`}</script>
        </html>
    );
};