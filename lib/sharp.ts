import sharp from 'sharp'

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'bmp'

export interface ConvertOptions {
  outputFormat: OutputFormat
  quality?: number
  width?: number
  height?: number
  maintainAspectRatio?: boolean
}

export async function convertImage(
  buffer: Buffer,
  options: ConvertOptions
): Promise<Buffer> {
  const { outputFormat, quality = 85, width, height, maintainAspectRatio = true } = options

  let pipeline = sharp(buffer)

  if (width || height) {
    pipeline = pipeline.resize({
      width: width || undefined,
      height: height || undefined,
      fit: maintainAspectRatio ? 'inside' : 'fill',
      withoutEnlargement: false,
    })
  }

  switch (outputFormat) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality })
      break
    case 'png':
      pipeline = pipeline.png()
      break
    case 'webp':
      pipeline = pipeline.webp({ quality })
      break
    case 'avif':
      pipeline = pipeline.avif({ quality })
      break
    case 'gif':
      pipeline = pipeline.gif()
      break
    case 'bmp':
      pipeline = pipeline.toFormat('bmp' as Parameters<typeof pipeline.toFormat>[0])
      break
  }

  return pipeline.toBuffer()
}

export async function getImageMetadata(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata()
  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    size: buffer.length,
  }
}
