import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params, env }: { params: { fileName: string }; env: Env }
) {
	const fileName = params.fileName

	const file = await env.FILE_STORAGE.get(fileName, 'arrayBuffer')

	if (!file) {
		return NextResponse.json({ error: 'File not found' }, { status: 404 })
	}

	// 根據文件擴展名設置正確的 Content-Type
	const contentType = getContentType(fileName)

	return new NextResponse(file, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}

function getContentType(fileName: string): string {
	const ext = fileName.split('.').pop()?.toLowerCase()
	switch (ext) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg'
		case 'png':
			return 'image/png'
		case 'gif':
			return 'image/gif'
		case 'webp':
			return 'image/webp'
		case 'mp4':
			return 'video/mp4'
		default:
			return 'application/octet-stream'
	}
}

export const config = {
	runtime: 'edge',
}
