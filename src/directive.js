import { setAttr } from './utils'
import getImageClass from './class'

// Vue plugin installer
const install = (Vue, opt) => {
  const vImg = getImageClass(opt)

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value)
    const vImgSrc = vImgIns.toImageSrc()
    const vImgErr = vImgIns.toErrorSrc()
    if (!vImgSrc) return

    const img = new Image()
    img.onload = () => {
      setAttr(el, vImgSrc, vnode.tag)
    }
    if (vImgErr) {
      img.onerror = () => {
        setAttr(el, vImgErr, vnode.tag)
      }
    }
    img.src = vImgSrc
  }

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const src = new vImg(binding.value).toLoadingSrc()
      if (src) setAttr(el, src, vnode.tag)
      update(el, binding, vnode)
    },

    update,
  })
}

export default install
