describe('延迟加载', function() {
  this.timeout(6000)

  const hash = '50f940dbce46148638e03d0778a4c5f8jpeg'
  const loading = '7b73ae0bcb1e68afacbaff7d4b25780bjpeg'

  const config1 = {hash: ''}
  const config2 = {hash, defer: true}

  const getImgs = (n) => {
    let str = ''
    while(n--) {
      str += '<img v-img="config1">'
    }
    str += '<img v-img="config2" style="positon: absolute; left: -10000px;" class="outer">'
    return str
  }

  const setViewModel = (id, delay, count) => {
    const el = document.createElement('section')
    el.id = id
    el.innerHTML = getImgs(count)

    document.body.appendChild(el)

    Vue.use(VueImg, {
      loading,
      delay
    })
    new Vue({ el: `#${id}`, data: {config1, config2} })
  }


  describe('{ 延迟加载图片在（非延迟加载图片没有加载完 && 5000ms内）不进行加载 }', () => {

    const id = `vm-${(+new Date).toString(32)}`

    before(done => {
      setViewModel(id, 5000, 100)
      setTimeout(done, 500) // 500ms保证100张非延迟图片加载不完。
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector(`#${id} .outer`).src
      const src = VueImg.getSrc({ hash: loading })

      expect(imgSrc).to.equal(src)

    })
  })

  describe('{ 延迟加载图片在（非延迟加载图片没有加载完 && 等待100ms后）进行加载 }', () => {

    const id = `vm-${(+new Date).toString(32)}`

    before(done => {
      setViewModel(id, 100, 100)
      setTimeout(done, 500)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector(`#${id} .outer`).src
      const src = VueImg.getSrc({ hash })

      expect(imgSrc).to.equal(src)

    })
  })

  describe('{ 延迟加载图片在（非延迟加载图片加载完后 && 5000ms内）进行加载 }', () => {

    const id = `vm-${(+new Date).toString(32)}`

    before(done => {
      setViewModel(id, 5000, 1)
      setTimeout(done, 500)
    })

    it('测试通过', () => {
      const imgSrc = document.querySelector(`#${id} .outer`).src
      const src = VueImg.getSrc({ hash })

      expect(imgSrc).to.equal(src)

    })
  })
})
