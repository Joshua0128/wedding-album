'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface FileItem {
	file: File
	progress: number
	status: 'waiting' | 'uploading' | 'done' | 'error'
	url?: string
}

export default function FileUploader() {
	const [files, setFiles] = useState<FileItem[]>([])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files).map((file) => ({
				file,
				progress: 0,
				status: 'waiting' as const,
			}))
			setFiles((prev) => [...prev, ...newFiles])
		}
	}

	const uploadFile = async (fileItem: FileItem) => {
		const formData = new FormData()
		formData.append('file', fileItem.file)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Upload failed')
			}

			const data = await response.json()
			return data.url
		} catch (error) {
			console.error('Upload error:', error)
			throw error
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const updatedFiles = [...files]

		for (let i = 0; i < updatedFiles.length; i++) {
			const fileItem = updatedFiles[i]
			if (fileItem.status !== 'done') {
				fileItem.status = 'uploading'
				setFiles([...updatedFiles])

				try {
					const url = await uploadFile(fileItem)
					fileItem.status = 'done'
					fileItem.url = url
				} catch (error) {
					fileItem.status = 'error'
				}

				setFiles([...updatedFiles])
			}
		}
	}

	return (
		<Card>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex items-center justify-center w-full">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<Upload className="w-10 h-10 mb-3 text-gray-400" />
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="font-semibold">
										Click to upload
									</span>{' '}
									or drag and drop
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Images or videos (MAX. 5MB)
								</p>
							</div>
							<input
								id="dropzone-file"
								type="file"
								className="hidden"
								multiple
								accept="image/*,video/*"
								onChange={handleFileChange}
							/>
						</label>
					</div>
					{files.length > 0 && (
						<div>
							<p className="text-sm font-medium text-gray-900 dark:text-white">
								Selected files:
							</p>
							<ul className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								{files.map((fileItem, index) => (
									<li key={index} className="mb-2">
										<div>{fileItem.file.name}</div>
										<Progress
											value={fileItem.progress}
											className="w-full h-1"
										/>
										<div>{fileItem.status}</div>
										{fileItem.url && (
											<a
												href={fileItem.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-500 hover:underline"
											>
												View File
											</a>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
					<Button type="submit" className="w-full">
						Upload
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
