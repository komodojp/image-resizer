import Sharp from 'sharp'

export interface TransformOptions {
  width: string
  height: string
  blur: string
  rotate: string
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  format: 'jpg' | 'png' | 'webp'
  quality: string
  grey: string
  normalize: string
}

Sharp.strategy.attention
const isNumeric = (n: unknown) => !isNaN(parseFloat(n as string)) && isFinite(n as number)

const clamp = (val: number, min = 0, max = 100) => Math.min(max, Math.max(min, val))

const parseIntQuery = (val: string | undefined, def: number | null = null, min = -100000, max = 100000) => {
  if (!val || !isNumeric(val)) return def
  return clamp(parseInt(val.toString()), min, max)
}

const parseFloatQuery = (val: string | undefined, def: number | null = null, min = -100000, max = 100000) => {
  if (!val || !isNumeric(val)) return def
  return clamp(parseFloat(val.toString()), min, max)
}

export function transform(options: Partial<TransformOptions>, setMime: (type: string) => void) {
  const sharp = Sharp()

  // prepare params
  const data = {
    width: parseIntQuery(options.width, null, 10, 2048),
    height: parseIntQuery(options.height, null, 10, 2048),
    blur: parseFloatQuery(options.blur, null, 0.3, 1000),
    rotate: parseFloatQuery(options.rotate, null, -360, 360),
    quality: parseIntQuery(options.quality, 90, 1, 100) as number,
    grey: options.grey === 'true',
    normalize: options.normalize === 'true'
  }

  if (process.env.NODE_ENV !== 'production') console.log(' > Image Transform', data)

  // resize
  if (data.width || data.height) {
    sharp.resize(data.width, data.height, {
      fit:
        options.fit && ['cover', 'contain', 'fill', 'inside', 'outside'].includes(options.fit) ? options.fit : 'cover',
      withoutEnlargement: true,
      position: Sharp.strategy.entropy
    })
  }

  // effects
  if (data.blur) sharp.blur(data.blur)
  if (data.rotate) sharp.rotate(data.rotate)
  if (data.grey) sharp.greyscale(true)
  if (data.normalize) sharp.normalize(true)

  // format
  if (options.format === 'jpg') sharp.jpeg({ quality: data.quality })
  else if (options.format === 'png') sharp.png({ quality: data.quality })
  else if (options.format === 'webp') sharp.webp({ quality: data.quality })

  if (options.format) setMime(options.format)

  return sharp
}
