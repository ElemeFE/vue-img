import * as constants from './constants'
import { throttle, on, off, inView } from './utils'


let hasBind = false
let viewOffset = 0

const { EVENTS, LAZY_CLASS } = constants

const loadImage = (item) => {
  const img = new Image()
  img.src = item.dataset.src

  img.onload = () => {
    item.src = item.dataset.src
    item.classList.remove(LAZY_CLASS)
  }
}

const handler = throttle(() => {

  const lazys = document.querySelectorAll(`img.${LAZY_CLASS}`)
  const len = lazys.length

  if (len > 0) {
    lazys.forEach(lazy => {
      if (inView(lazy, viewOffset)) {
        loadImage(lazy)
      }
    })
  }

}, 200)

const events = (el, bool) => {
  EVENTS.forEach(ev => {
    bool
    ? on(el, ev, handler)
    : off(el, ev, handler)
  })
}

const lazy = (bool, offset) => {
  if (!typeof window || hasBind) return false
  if (bool && !hasBind) hasBind = true
  if (typeof offset === 'number') viewOffset = offset
  events(window, bool)
}

export default lazy



