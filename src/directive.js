import { setAttr, inViewport } from './utils'
import getImageClass from './class'
import VueImg from './base'

// Vue plugin installer
const install = (Vue, opt = {}) => {
  Object.defineProperty(VueImg, 'cdnProvider', {
    // 向前兼容，默认使用 qiniu
    value: opt.cdn === 'ali' ? opt.cdn : 'qiniu',
    enumerable: true,
    configurable: false,
    writable: false,
  })

  const vImg = getImageClass(opt)
  const promises = []

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value)
    const vImgSrc = vImgIns.toImageSrc()
    const vImgErr = vImgIns.toErrorSrc()

    if (!vImgSrc) return Promise.resolve()

    // 防止重复渲染
    if (binding.oldValue) {
      const oldVImgIns = new vImg(binding.oldValue)
      if (vImgSrc === oldVImgIns.toImageSrc()) {
        return Promise.resolve()
      }
    }

    const img = new Image()
    const delay = +vImgIns.delay || 5000

    return new Promise(resolve => {
      img.onload = () => {
        setAttr(el, img.src, vnode.tag)
        resolve()
      }
      img.onerror = () => {
        // webp图片加载失败降级到普通图片
        // 兼容客户端处理webp失败的情况
        // 兼容阿里云的 webp 拼接格式（`/format,webp`）
        const webpReg = /format[/,]webp\/?/
        if (webpReg.test(img.src)) {
          img.src = vImgSrc.replace(webpReg, '')
        } else if (vImgErr) {
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
      const { defer } = binding.value

      if (loadSrc) setAttr(el, loadSrc, vnode.tag)
      if (!defer) {
        promises.push(update(el, binding, vnode))
      }
    },
    inserted(el, binding, vnode) {
      const { defer } = binding.value
      if (!defer) return
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
