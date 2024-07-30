import { createFetch } from '@cloudflare/next-on-pages/fetch'
import { next } from '@cloudflare/next-on-pages'

const worker = next({
	streamFetcherMaxRuntime: 60000,
	disableChunkedEncoding: false,
})

const fetch = (request, env, ctx) => {
	const customFetch = createFetch({
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
		return worker.fetch(request, env, ctx)
	} catch (e) {
		console.error('Worker fetch error:', e)
		return new Response(e.message || e.toString(), { status: 500 })
	}
}

export default {
	fetch,
}
