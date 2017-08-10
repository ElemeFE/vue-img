describe('全局配置', function() {
  this.timeout(6000)

  const hash = '50f940dbce46148638e03d0778a4c5f8jpeg'
  const loading = '7b73ae0bcb1e68afacbaff7d4b25780bjpeg'
  const error = '4f88f93f3797600783990d32e5673ab7jpeg'
  const createViewModel = ({ option, config }, style) => {
    const el = document.createElement('div')
    const id = `vm-${Date.now().toString(16)}`

    if (style) {
      Object.assign(el.style, style)
    }

    el.id = id;
    el.innerHTML = `<img v-img="config">`
    document.body.appendChild(el)

    VueImg.installed = false // Allow VueImg to be installed again
    Vue.use(VueImg, option)
    return new Vue({
      el: `#${id}`,
      data: { config }
    })
  }

  // div# out of screen view
  describe('{ globalLazy(全局): true, lazy(局部): true, inView: false }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading, globalLazy: true },
        config: { hash, lazy: true }
      }, {
        marginTop: `${window.screen.height + 500}px`
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash: loading
        }))
    })
  })

  describe('{ globalLazy(全局): true, lazy(局部): false, inView: false }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading, globalLazy: true },
        config: { hash }
      }, {
        marginTop: `${window.screen.height + 500}px`
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash
        }))
    })
  })

  describe('{ globalLazy(全局): false, lazy(局部): true, inView: false }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading },
        config: { hash, lazy: true }
      }, {
        marginTop: `${window.screen.height + 500}px`
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash
        }))
    })
  })
  // Because it the first test, so the div# in the screen view
  describe('{ globalLazy(全局): true, lazy(局部): true, inView: true }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading, globalLazy: true },
        config: { hash, lazy: true }
      }, {
        position: 'absolute',
        top: 0,
        left: 0
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash
        }))
    })
  })

  describe('{ loading }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading },
        config: { hash: 'xxxxxxxxxxx' }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash: loading
        }))
    })
  })

  describe('{ loading, error }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading, error },
        config: { hash: 'xxxxxxxxxxx' }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash: error
        }))
    })
  })

  describe('{ prefix }', () => {
    const prefix = 'https://fuss10.elemecdn.com'
    let vm

    before(done => {
      vm = createViewModel({
        option: { prefix },
        config: { hash }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          prefix, hash
        }))
    })
  })

  describe('{ quality }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { quality: 80 },
        config: { hash }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash,
          quality: 80
        }))
    })
  })

  describe('局部 + 全局 { loading }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { loading },
        config: { loading: '', hash: 'xxx' }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal('')
    })
  })

  describe('局部 + 全局 { error }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { error },
        config: { error: '', hash: 'xxx' }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal('')
    })
  })

  describe('局部 + 全局 { quality }', () => {
    let vm

    before(done => {
      vm = createViewModel({
        option: { quality: 80 },
        config: { quality: 90, hash }
      })
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const img = vm.$el.querySelector('img')
      expect(img.src)
        .to.equal(VueImg.getSrc({
          hash,
          quality: 90
        }))
    })
  })


})
