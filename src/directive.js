import { setAttr, inView } from './utils'
import getImageClass from './class'
import { LAZY_CLASS } from './constants'
import initLazy from './lazy'

// Vue plugin installer
const install = (Vue, opt = {}) => {
  const vImg = getImageClass(opt)
  const { enableLazy, viewOffset: offset } = opt
  const promises = []

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value)
    const vImgSrc = vImgIns.toImageSrc()
    const vImgErr = vImgIns.toErrorSrc()

    if (!vImgSrc) return Promise.resolve()

    const img = new Image()
    const delay = +vImgIns.delay || 5000

    return new Promise(resolve => {
      img.onload = () => {
        setAttr(el, vImgSrc, vnode.tag)
        resolve()
      }
      if (vImgErr) {
        img.onerror = () => {
          setAttr(el, vImgErr, vnode.tag)
          resolve()
        }
      }
      setTimeout(() => {
        resolve()
      }, delay)
      img.src = vImgSrc
    })
  }

  enableLazy && initLazy(true, offset)

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const vImgIns = new vImg(binding.value)
      const loadSrc = vImgIns.toLoadingSrc()
      const dataSrc = vImgIns.toImageSrc()
      const { lazy, defer } = binding.value

      if (loadSrc) setAttr(el, loadSrc, vnode.tag)
      if (enableLazy) {
        if (lazy === true) {
          el.classList.add(LAZY_CLASS)
          el.setAttribute('data-src', dataSrc)
        } else {
          update(el, binding, vnode)
        }
      } else {
        if (!defer) {
          promises.push(update(el, binding, vnode))
        }
      }
    },

    inserted(el, binding, vnode) {
      const { lazy, defer } = binding.value
      if (enableLazy) {
        if (inView(el) && lazy === true) {
          update(el, binding, vnode)
        }
      } else {
        if (!defer) return
        if (inView(el)) {
          promises.push(update(el, binding, vnode))
        } else {
          Vue.nextTick(() => {
            Promise.all(promises)
            .then(() => {
              promises.length = 0
              update(el, binding, vnode)
            })
            .catch(() => {})
          })
        }
      }
    },
    update,
  })
}

export default install
