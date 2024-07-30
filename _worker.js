import { createFetch } from '@cloudflare/next-on-pages/fetch'

const worker = {
	async fetch(request, env, ctx) {
		const fetch = createFetch({
			request,
			env,
			ctx,
			next: {
				config: {
					basePath: '',
					i18n: undefined,
				},
			},
		})

		try {
			return await env.ASSETS.fetch(request)
		} catch (e) {
			return new Response(e.message || e.toString(), { status: 500 })
		}
	},
}

export default worker
