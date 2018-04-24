describe('检测核心函数 getSrc', () => {
  const config = { hash: '50f940dbce46148638e03d0778a4c5f8jpeg' }

  it('{ null }', () => {
    expect(VueImg.getSrc())
      .to.equal('')
    expect(VueImg.getSrc({}))
      .to.equal('')
    expect(VueImg.getSrc({ hash: 12450 }))
      .to.equal('')
    expect(VueImg.getSrc({ hash: null }))
      .to.equal('')
  })

  it('{ hash }', () => {
    expect(VueImg.getSrc(config))
      .to.match(/^http:\/\/fuss10.elemecdn.com\//)
      .to.include('/5/0f/940dbce46148638e03d0778a4c5f8jpeg.jpeg')
      .to.include('?imageMogr/')
      .to.match(/format\/webp\/$/)
  })

  it('{ hash, prefix }', () => {
    config.prefix = 'eleme.me'
    expect(VueImg.getSrc(config))
      .to.match(/^eleme\.me\//)
  })

  it('{ hash, prefix, suffix }', () => {
    config.suffix = 'github'
    expect(VueImg.getSrc(config))
      .to.match(/github$/)
  })

  it('{ hash, prefix, suffix, quality }', () => {
    config.quality = 75
    expect(VueImg.getSrc(config))
      .to.include('/quality/75/')
  })

  it('{ hash, prefix, suffix, quality, width, height }', () => {
    config.width = 100
    expect(VueImg.getSrc(config))
      .to.include('/thumbnail/100x/')

    config.height = 200
    expect(VueImg.getSrc(config))
      .to.include('/!100x200r/gravity/Center/crop/100x200/')
  })

  it('{ fallback }', () => {
    VueImg.canWebp = false
    config.fallback = 'gif'
    expect(VueImg.getSrc(config))
      .to.include('format/gif')
  })

  it('{ format }', () => {
    VueImg.canWebp = true
    config.format = 'png'
    expect(VueImg.getSrc(config))
      .to.include('format/png')
  })

  it('{ urlFormatter }', () => {
    const _config = Object.assign({}, config)
    _config.urlFormatter = url => url.replace(/\b(imageMogr)\b/, $1 => `${$1}2`)
    expect(VueImg.getSrc(_config))
      .to.include('imageMogr2/')
  })
})
