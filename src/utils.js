const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
const html = document.documentElement
const hasDPR = html.hasAttribute('data-dpr')

export const copyKeys = ({ source, target, keys }) => {
  keys.forEach(key => {
    if (hasProp(source, key)) {
      target[key] = source[key]
    }
  })
}

export const setAttr = (el, src, tag) => {
  if (tag === 'img') {
    el.src = src
  } else {
    el.style.backgroundImage = `url('${src}')`
  }
}

export const resize = (size) => {
  let viewWidth
  try {
    viewWidth = +(html.getAttribute('style').match(/(\d+)/) || [])[1]
  } catch(e) {
    console.error('adapt参数需要配合lib-flexible库使用：https://github.com/amfe/lib-flexible')
  }

  if (hasDPR && !Number.isNaN(viewWidth) && typeof viewWidth === 'number') {
    return (size * viewWidth) / 75 // 75 is the 1/10 iphone6 deivce width pixel
  } else {
    return size
  }
}

export const inViewport = (el) => {
  const rect = el.getBoundingClientRect()

  return rect.top > 0
    && rect.bottom < window.innerHeight
    && rect.left > 0
    && rect.right < window.innerWidth
}
