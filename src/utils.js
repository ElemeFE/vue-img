const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
const html = document.documentElement

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

export const throttle = (action, delay) => {
  let timeout = null
  let lastRun = 0
  return function() {
    if (timeout) {
      return
    }
    const elapsed = Date.now() - lastRun
    const context = this
    const args = arguments
    const runCallback = function() {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
  }
}

export const on = (el, ev, fn) => {
  el.addEventListener(ev, fn)
}

export const off = (el, ev, fn) => {
  el.removeEventListener(ev, fn)
}

export const inView = (el, offset = 0) => {
  const rect = el.getBoundingClientRect()

  return rect.top >= 0
  && rect.bottom <= window.innerHeight + offset
  && rect.left >= 0
  && rect.right <= window.innerWidth
}

export const resize = (size) => {
  let viewWidth
  const dpr = window.devicePixelRatio
  const dataDpr = document.documentElement.getAttribute('data-dpr')
  const ratio = dataDpr ? (dpr / dataDpr) : dpr

  try {
    viewWidth = +(html.getAttribute('style').match(/(\d+)/) || [])[1]
  } catch(e) {
    const w = html.offsetWidth
    if (w / dpr > 540) {
      viewWidth = 540 * dpr / 10
    } else {
      viewWidth = w / 10
    }
  }

  viewWidth = viewWidth * ratio

  if (Number(viewWidth) >= 0 && typeof viewWidth === 'number') {
    return (size * viewWidth) / 75 // 75 is the 1/10 iphone6 deivce width pixel
  } else {
    return size
  }
}
