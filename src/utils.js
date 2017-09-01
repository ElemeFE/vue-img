const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

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

  return rect.top > 0
  && rect.bottom < window.innerHeight + offset
  && rect.left > 0
  && rect.right < window.innerWidth
}



