// Cloudflare Worker: the Cloudflare equivalent of scripts/entrypoint.sh.
// Serves /env.js generated from the Worker's VITE_* vars (wrangler.jsonc `vars`
// or dashboard Variables), so config is read at runtime instead of baked in at
// build time. Every other request is served from the static assets in dist/.

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  [key: string]: unknown
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/env.js') {
      const runtimeEnv = Object.fromEntries(
        Object.entries(env).filter(
          (entry): entry is [string, string] =>
            entry[0].startsWith('VITE_') && typeof entry[1] === 'string',
        ),
      )

      return new Response(`window._env_ = ${JSON.stringify(runtimeEnv)};\n`, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          // Runtime config must never be cached
          'Cache-Control': 'no-store',
        },
      })
    }

    return env.ASSETS.fetch(request)
  },
}
