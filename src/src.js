import VueImg from './base'

// Translate hash to path
const hashToPath = hash => hash.replace(/^(\w)(\w\w)(\w{29}(\w*))$/, '/$1/$2/$3.$4')

// Get image size
const getSize = (width, height) => {
  const thumb = 'thumbnail/'
  const cover = `${width}x${height}`

  if (width && height) return `${thumb}!${cover}r/gravity/Center/crop/${cover}/`
  if (width) return `${thumb}${width}x/`
  if (height) return `${thumb}x${height}/`
  return ''
}

// Get image size
const getSrc = ({ hash, width, height, prefix, suffix, quality, disableWebp } = {}) => {
  if (!hash || typeof hash !== 'string') return ''

  const _prefix = typeof prefix === 'string' ? prefix : VueImg.cdn
  const _suffix = typeof suffix === 'string' ? suffix : ''
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : ''
  const _format = !disableWebp && VueImg.canWebp ? 'format/webp/' : ''
  const params = `${_quality}${_format}${getSize(width, height)}${_suffix}`

  return _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '')
}

export default getSrc
