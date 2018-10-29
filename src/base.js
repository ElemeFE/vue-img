import { checkSupport } from './device'

const VueImg = Object.create(null)

// Check webP support
VueImg.canWebp = checkSupport() || (!![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0)

// Default cdn prefix
const protocol = location.protocol === 'https:' ? 'https://' : 'http://'
const env = document.domain.match(/.(alpha|beta|ar).ele(net)?.me$/)
VueImg.cdn = protocol + (env ? `fuss${env[0]}` : 'fuss10.elemecdn.com')

export default VueImg
