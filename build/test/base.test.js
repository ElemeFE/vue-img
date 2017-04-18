describe('检测依赖', () => {
  it('Vue 2 已安装', () => {
    expect(Vue).to.exist
    expect(Vue.version.split('.')[0]).to.equal('2')
  })

  it('VueImg 已安装', () => {
    expect(VueImg).to.be.an('object')
  })
})
