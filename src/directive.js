import { setAttr, inViewport } from './utils'
import getImageClass from './class'

// Vue plugin installer
const install = (Vue, opt) => {
  const vImg = getImageClass(opt)
  const promises = []

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value)
    const vImgSrc = vImgIns.toImageSrc()
    const vImgErr = vImgIns.toErrorSrc()

    if (!vImgSrc) return

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

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const loadSrc = new vImg(binding.value).toLoadingSrc()
      const { lazy } = binding.value

      if (loadSrc) setAttr(el, loadSrc, vnode.tag)
      if (!lazy) {
        promises.push(update(el, binding, vnode))
      }
    },
    inserted(el, binding, vnode) {
      const { lazy } = binding.value
      if (!lazy) return
      if (inViewport(el)) {

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
    },
    update,
  })
}

export default install
