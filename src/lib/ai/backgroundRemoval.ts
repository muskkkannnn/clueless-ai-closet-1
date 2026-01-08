export async function removeBackground(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer()
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        body: arrayBuffer,
      }
    )
    
    if (!response.ok) {
      throw new Error(`Background removal failed: ${await response.text()}`)
    }
    
    return await response.blob()
  }
  