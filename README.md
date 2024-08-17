# BunSite

A relatively basic Bun web server with some pretty handy things built in!

1. [The Basics](#the-basics)
2. [Startup guide](#startup-guide)
3. [The Files](#the-files)

## The Basics

The server is run with ElysiaJS on Bun, with Tailwindcss for styling. 
Templates are written in `tsx`, and tailwind styles are loaded from `templates/**/*.tsx`.
By default the site is rate limited to 150 requests per 15 seconds.
File extensions for static files don't matter, they're handled automatically. Linking to `/static/some_image` where `public/some_image.webp` exists will return the image properly. Either avoid same-name files with different types, or specify the type.
All static files—excludes pages—are cached with the "no-cache" policy, meaning they are checked for updates on every refresh.

## Startup Guide

First, set your site's name in `constants.ts`.

Create a file in `templates/` ending in `.tsx`, for example: `templates/home.tsx`.
Then `export default` a new function, typically the name of the file, and have it return `Base` filled with content.
```tsx
import Base from "./base";

export default function Home() {
  return (
    <Base title="Home">
      <h1>Hello, world!</h1>
    </Base>
  );
};
```

All created files must be manually imported into `main.tsx` (unless you want me to add my fucking nasty 'solution'), so import your file, then create a route for it.
```diff
+ import Home from "./templates/home";

const server = new Elysia()
...
.onError(({...

+ .get("/" () => <Home />)
```
one QoL addition is adding
```tsx
.get("///", ({ redirect }) => redirect('/'))
```
to handle the automatic redirects, depending on your configuration (Apache, Nginx, running it directly on low ports...)

Now run `bun start`, and you're all set!

Next steps:
1. Setting up a `systemd` service to run it on startup
2. Configuring your reverse proxy — Apache/Nginx/other

## The Files

### Middleware

#### `middleware/blogs.tsx`

Loads all Markdown blogs from `blogs/featured/*.md` `blogs/**/*.md` (does not read `.` folders)
Given the file name `an_awesome_experience!!.md`, the blog title will be "An Awesome Experience!!".
Associated cover images should be placed in `public/blogs/[blog_filename]`.

#### `middleware/index.ts`

Single file to manage middleware for `main.tsx` to import from.

#### `middleware/rateLimiter.ts`

Class to keep track of number of requests per IP, clearing all values every 15s. **NOT** a per-user clock.

#### `middleware/static.ts`

Gah damn a lotta hours went into just this single file...
Does what it says on the label: handles static files, but with extras!
There's caching involved; on every restart of the server all static files are hashed, and that's used as the ETag when a file is requested.

### Templates

#### `templates/base.tsx`

Basic shell to include the important things: title, header, footer, any extra `head` elements, and the content.

#### `templates/blog.tsx`

A template with such a nice design I use it for most pages outside of the home page...

#### `templates/blogs.tsx`

Shows all blogs in a nice format.

#### `templates/e404.tsx`

The 404 page. Do modify, as it sucks.

#### `templates/footer.tsx`

This feels redundant.

#### `templates/header.tsx`

Oh wow big much cool it's a header what'd you expect

### Main

#### `build.ts`

Deletes existing compressed files (only JS and `styles.css`)
Creates the tailwind file.
Then compresses js and css files.

#### `constants.ts`

Currently just holds one constant, might change later.

#### `logging.ts`

If you set up a `systemd` service to run this, add a line `Environment="RUN_BY=sytemd"`

#### `main.tsx`

The brains of the operation. Starts the Elysia servers (redirect is optional with proxy)



And then the rest of the files are pretty self-explanatory.
