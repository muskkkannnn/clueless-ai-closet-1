'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UploadButton() {
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'top') // or let user select

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(`Upload failed: ${data.details || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label htmlFor="upload-file" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
        {uploading ? 'Uploading...' : 'Upload Clothing'}
      </label>
      <input
        id="upload-file"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
    </div>
  )
}

