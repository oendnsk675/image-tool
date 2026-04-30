export async function removeBg(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const { removeBackground } = await import('@imgly/background-removal-node')

  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType })
  const resultBlob = await removeBackground(blob)
  const arrayBuffer = await resultBlob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
