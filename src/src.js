import VueImg from './base'
import { resize } from './utils'

// Translate hash to path
const hashToPath = hash => hash.replace(/^(\w)(\w\w)(\w{29}(\w*))$/, '/$1/$2/$3.$4')

// Get image format
const getFormat = ({ format, fallback }) => {
  const isFormat = /^(jpg|jpeg|png|gif)$/

  if (isFormat.test(format)) return `format/${format}/`
  if (VueImg.canWebp) return 'format/webp/'
  return isFormat.test(fallback)
    ? `format/${fallback}/`
    : ''
}

// Get image size
const getSize = ({ width, height, adapt }) => {

  const w = width && (adapt ? resize(width) : width)
  const h = height && (adapt ? resize(height) : height)

  const thumb = 'thumbnail/'
  const cover = `${w}x${h}`

  if (width && height) return `${thumb}!${cover}r/gravity/Center/crop/${cover}/`
  if (width) return `${thumb}${w}x/`
  if (height) return `${thumb}x${h}/`

  return ''
}

// Get image size
const getSrc = ({
  hash, adapt,
  width, height, quality,
  format, fallback,
  prefix, suffix,
} = {}) => {
  if (!hash || typeof hash !== 'string') return ''

  const _prefix = typeof prefix === 'string' ? prefix : VueImg.cdn
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : ''
  const _format = getFormat({ format, fallback })
  const _size = getSize({ width, height, adapt })
  const _suffix = typeof suffix === 'string' ? suffix : ''
  const params = `${_quality}${_format}${_size}${_suffix}`

  return _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '')
}

export default getSrc
