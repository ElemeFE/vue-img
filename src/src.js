import VueImg from './base'

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
const getSize = ({ width, height }) => {
  const thumb = 'thumbnail/'
  const cover = `${width}x${height}`

  if (width && height) return `${thumb}!${cover}r/gravity/Center/crop/${cover}/`
  if (width) return `${thumb}${width}x/`
  if (height) return `${thumb}x${height}/`
  return ''
}

// Get image size
const getSrc = ({
  hash,
  width, height, quality,
  format, fallback,
  prefix, suffix,
} = {}) => {
  if (!hash || typeof hash !== 'string') return ''

  const _prefix = typeof prefix === 'string' ? prefix : VueImg.cdn
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : ''
  const _format = getFormat({ format, fallback })
  const _size = getSize({ width, height })
  const _suffix = typeof suffix === 'string' ? suffix : ''
  const params = `${_quality}${_format}${_size}${_suffix}`

  return _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '')
}

export default getSrc
