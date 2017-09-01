import { copyKeys } from './utils'
import getSrc from './src'

export default (opt = {}) => {
  class GlobalOptions {
    constructor() {
      // Global
      copyKeys({
        source: opt,
        target: this,
        keys: [
          'loading', 'error',
          'quality', 'delay', 'viewOffset',
          'prefix', 'suffix', 'adapt', 'enableLazy',
        ],
      })
    }

    hashToSrc(hash) {
      const params = { hash }
      // Get src
      copyKeys({
        source: this,
        target: params,
        keys: [
          'width', 'height', 'quality',
          'format', 'fallback', 'adapt',
          'prefix', 'suffix',
        ],
      })
      return getSrc(params)
    }
  }

  class vImg extends GlobalOptions {
    constructor(value) {
      const params = value && typeof value === 'object'
        ? value
        : { hash: value }

      super()
      // Directive
      copyKeys({
        source: params,
        target: this,
        keys: [
          'hash', 'loading', 'error',
          'width', 'height', 'quality',
          'format', 'fallback', 'adapt',
          'prefix', 'suffix', 'defer', 'lazy',
        ],
      })
    }

    toImageSrc() {
      return this.hashToSrc(this.hash)
    }

    toLoadingSrc() {
      return this.hashToSrc(this.loading)
    }

    toErrorSrc() {
      return this.hashToSrc(this.error)
    }
  }

  return vImg
}
