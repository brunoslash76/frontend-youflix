interface PutToPresignedUrlOptions {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

export const putToPresignedUrlStore = (
  uploadUrl: string,
  file: Blob,
  { onProgress, signal }: PutToPresignedUrlOptions = {}
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type)

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed with status ${xhr.status}`))

    xhr.onerror = () => reject(new Error('Network error while uploading to storage'))
    xhr.onabort = () => reject(new Error('Upload aborted'))

    signal?.addEventListener('abort', () => xhr.abort(), { once: true })
    xhr.send(file)
  })

