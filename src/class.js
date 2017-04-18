import { copyKeys } from './utils'
import getSrc from './src'

export default (opt = {}) => {
  class GlobalOptions {
    constructor() {
      copyKeys({
        source: opt,
        target: this,
        keys: [
          'loading', 'error',
          'quality',
          'prefix', 'suffix',
          'disableWebp',
        ],
      })
    }

    hashToSrc(hash) {
      const params = { hash }

      copyKeys({
        source: this,
        target: params,
        keys: [
          'width', 'height', 'quality',
          'prefix', 'suffix',
          'disableWebp',
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
      copyKeys({
        source: params,
        target: this,
        keys: [
          'hash', 'loading', 'error',
          'width', 'height', 'quality',
          'prefix', 'suffix',
          'disableWebp',
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
