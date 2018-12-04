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

const getAliSize = ({ width, height, adapt }) => {
  let w = width && (adapt ? resize(width) : width)
  let h = height && (adapt ? resize(height) : height)
  if (typeof w === 'number') {
    w = Math.floor(w)
  }
  if (typeof h === 'number') {
    h = Math.floor(h)
  }
  if (width && height) return `/resize,w_${w},h_${h},m_fixed`
  if (width) return `/resize,w_${w}`
  if (height) return `/resize,h_${h}`
  return ''
}

const getAliFormat = ({ format, fallback }) => {
  const formatRule = /^(jpg|png|gif)$/
  if (formatRule.test(format)) return `/format,${format}`
  // https://help.aliyun.com/document_detail/44704.html
  if (format === 'jpeg') return '/format,jpg/interlace,1'
  if (VueImg.canWebp) return '/format,webp'
  return formatRule.test(fallback) ? `/format,${fallback}` : ''
}


const getAliOssSrc = ({
  hash, adapt,
  width, height, quality,
  format, fallback,
  prefix, suffix,
  urlFormatter,
} = {}) => {
  const _prefix = typeof prefix === 'string' ? prefix : VueImg.aliCdn
  const _suffix = typeof suffix === 'string' ? suffix : ''
  let src = _prefix + hashToPath(hash)
  // 阿里只支持如下格式图片的处理
  const supportFormats = /(jpg|png|bmp|gif|webp|tiff)$/
  if (supportFormats.test(hash)) {
    const _quality = typeof quality === 'number' ? `/quality,q_${quality}` : ''
    const _size = getAliSize({ width, height, adapt })
    const _format = getAliFormat({ format, fallback })
    const params = `${_quality}${_format}${_size}${_suffix}`
    src += (params ? `?x-oss-process=image${params}` : '')
  } else {
    src += _suffix
  }
  if (typeof urlFormatter === 'function') src = urlFormatter(src)
  return src
}

const getQiniuSrc = ({
  hash, adapt,
  width, height, quality,
  format, fallback,
  prefix, suffix,
  urlFormatter,
} = {}) => {
  const _prefix = typeof prefix === 'string' ? prefix : VueImg.qiniuCdn
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : ''
  const _format = getFormat({ format, fallback })
  const _size = getSize({ width, height, adapt })
  const _suffix = typeof suffix === 'string' ? suffix : ''
  const params = `${_quality}${_format}${_size}${_suffix}`
  let src = _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '')
  if (typeof urlFormatter === 'function') src = urlFormatter(src)
  return src
}


export default (options = {}) => {
  if (!options.hash || typeof options.hash !== 'string') return ''
  if (options.cdn === 'ali') {
    return getAliOssSrc(options)
  }
  return getQiniuSrc(options)
}
