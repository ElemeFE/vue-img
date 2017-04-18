describe('检测指令', function() {
  this.timeout(6000)

  const hash = '50f940dbce46148638e03d0778a4c5f8jpeg'
  const loading = '7b73ae0bcb1e68afacbaff7d4b25780bjpeg'
  const error = '4f88f93f3797600783990d32e5673ab7jpeg'
  const config = { loading }
  const re = /^url\(['"]?(.*?)['"]?\)$/
  let vm

  before(done => {
    const el = document.createElement('section')
    el.id = 'app'
    el.innerHTML = '<img v-img="config"><div v-img="config"></div>'
    document.body.appendChild(el)

    Vue.use(VueImg)
    vm = new Vue({ el: '#app', data: { config } })
    setTimeout(done, 1000)
  })

  describe('{ loading }', () => {
    before(done => {
      Vue.set(vm.config, 'hash', 'xxxxxx')
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc({ hash: loading })

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ error }', () => {
    before(done => {
      Vue.set(vm.config, 'error', error)
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc({ hash: error })

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ hash }', () => {
    before(done => {
      Vue.set(vm.config, 'hash', hash)
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc(config)

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ hash, suffix }', () => {
    before(done => {
      Vue.set(vm.config, 'suffix', 'blur/3x5')
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc(config)

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ hash, suffix, height }', () => {
    before(done => {
      Vue.set(vm.config, 'height', 100)
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc(config)

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ hash, suffix, width, height }', () => {
    before(done => {
      Vue.set(vm.config, 'width', 100)
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc(config)

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('{ hash, suffix, width, height, quality }', () => {
    before(done => {
      Vue.set(vm.config, 'quality', 80)
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc(config)

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })

  describe('hash', () => {
    before(done => {
      vm.config = hash
      setTimeout(done, 2000)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector('#app img').src
      const divImg = document.querySelector('#app div').style.backgroundImage.match(re)[1]
      const src = VueImg.getSrc({ hash })

      expect(imgSrc).to.equal(src)
      expect(divImg).to.equal(src)
    })
  })
})
