import { NextResponse } from 'next/server'

export async function POST(request: Request, { env }: { env: Env }) {
	const formData = await request.formData()
	const file = formData.get('file') as File | null

	if (!file) {
		return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
	}

	const bytes = await file.arrayBuffer()
	const fileName = `${Date.now()}-${file.name}`

	await env.FILE_STORAGE.put(fileName, bytes)

	const url = `/api/file/${fileName}`

	return NextResponse.json({ url })
}

export const config = {
	runtime: 'edge',
}
