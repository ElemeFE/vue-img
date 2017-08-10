import { setAttr, inView } from './utils'
import getImageClass from './class'
import { LAZY_CLASS } from './constants'
import initLazy from './lazy'

// Vue plugin installer
const install = (Vue, opt) => {
  const vImg = getImageClass(opt)
  const { globalLazy } = opt
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

  globalLazy && initLazy(true)

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const vImgIns = new vImg(binding.value)
      const loadSrc = vImgIns.toLoadingSrc()
      const dataSrc = vImgIns.toImageSrc()
      const { lazy } = binding.value

      if (loadSrc) setAttr(el, loadSrc, vnode.tag)

      if (lazy === true && globalLazy === true) {
        el.classList.add(LAZY_CLASS)
        el.setAttribute('data-src', dataSrc)
      } else {
        update(el, binding, vnode)       
      }
    },

    inserted(el, binding, vnode) {
      const { lazy } = binding.value

      if (inView(el) && lazy === true && globalLazy === true) {
        update(el, binding, vnode)
      }
    },

    update,
  })
}

export default install
