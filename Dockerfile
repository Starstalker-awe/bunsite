FROM oven/bun:alpine AS base
WORKDIR /home/bun/site

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN mkdir /home/bun/site/blogs
RUN mkdir /home/bun/site/public
RUN chown -R 1000:1000 /home/bun/site/public

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "main.tsx" ]