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
