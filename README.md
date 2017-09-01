# vue-img

> hash2path wrapper for vue 2, also surport image delay load lazy load and image size adaptation for various devices.

### 安装插件

```JS
// 默认全局配置
Vue.use(VueImg)

// 自定义全局配置
Vue.use(VueImg, {
  loading: '',
  error: '',
  prefix: '',
  quality: 100,
  enableLazy: true // 如果要使用图片懒加载功能，必须配置此项
  adapt: true,
  viewOffset: 500 // 单位 px
})
```

### 使用指令

> 由于 Vue 2 删除了指令中的 params，故采用 object value 的形式传入参数

```HTML
<!-- 设置图片 + 默认参数 -->
<img v-img="'xxx'">
<!-- 设置图片 + 自定义参数 -->
<img v-img="{ hash: 'xxx', width: 233, height: 666, lazy: true }">
<!-- or -->
<img v-img="{ hash: 'xxx', width: 233, height: 666, defer: true, adapt: false }">


<!-- 设置背景 + 默认参数 -->
<div v-img="'xxx'"></div>
<!-- 设置背景 + 自定义参数（div原始不支持lazy选项） -->
<div v-img="{ hash: 'xxx', width: 12, height: 450 }"></div>
```

### 可读属性和方法

VueImg 提供了一些属性，可用于指令以外的场合。你应当视它们为**只读**属性，避免直接修改，同时VueImg提供了`getSrc({ ... })`方法。

```JS
VueImg.cdn             // [String]   当前环境的默认 CDN
VueImg.canWebp         // [Boolean]  当前环境是否支持 webP
VueImg.getSrc({ ... }) // [Function] 获取图片地址
```

### 参数列表


| 名称         | 描述                        | 全局配置 | 指令参数 | getSrc 函数 |
| ---------- | ------------------------- | :--: | :--: | :-------: |
| hash       | [String] 图片哈希（必填）         |  ✕   |  〇   |     〇     |
| width      | [Number] 宽度               |  ✕   |  〇   |     〇     |
| height     | [Number] 高度               |  ✕   |  〇   |     〇     |
| format     | [String] 强制图片格式           |  ✕   |  〇   |     〇     |
| fallback   | [String] 不支持 webP 时转换格式   |  ✕   |  〇   |     〇     |
| quality    | [Number] 图片质量             |  〇   |  〇   |     〇     |
| prefix     | [String] CDN 地址前缀         |  〇   |  〇   |     〇     |
| suffix     | [String] CDN 处理后缀 [?]     |  〇   |  〇   |     〇     |
| loading    | [String] 加载中默认图片哈希        |  〇   |  〇   |     ✕     |
| error      | [String] 失败替换图片哈希         |  〇   |  〇   |     ✕     |
| adapt      | [Boolean] 图片尺寸是否适配设备屏幕    |  〇   |  〇   |     〇     |
| delay      | [Number] 设置延迟加载最大等待时长（ms） |  〇   |  ✕   |     ✕     |
| defer      | [Boolean] 图片是否进行延迟加载      |  ✕   |  〇   |     ✕     |
| enableLazy | [Boolean]图片懒加载和延迟加载的切换    |  〇   |  ✕   |     ✕     |
| lazy       | [Boolean]图片是否需要懒加载        |  ✕   |  〇   |     ✕     |
| viewOffset | [Number]判断图片是否在视窗的高度偏移    |  〇   |  ✕   |     ✕     |


- suffix 参数可用于模糊、旋转等特殊处理，具体请参考[《七牛 CDN 开发者文档》](http://developer.qiniu.com/code/v6/api/kodo-api/image/imagemogr2.html)。
- 图片 lazy load 和 defer load 是互斥的功能，两种图片加载方式只能够二选一，通过 enableLazy 全局配置可以在两种图片加载方式中切换，当 enableLazy 为 true 启动 lazy load。当其为 false 时或者不配置时，启动 defer load 功能。 请不要同时使用「delay、defer」和「viewOffset、lazy」这两组参数。
- adapt 参数表示图片尺寸是否适配设备屏幕大小，指令参数会覆盖全局配置，例如：当全局配置 adapt 参数 为 true 时，指令参数 adpat 配置为 false，那么该图片不会根据设备 viewport 调整尺寸。
- 图片defer load延迟加载的含义，当参数 defer 配置为 false 时，图片在 v-img 指令的 bind 钩子函数中加载，当参数 defer 配置为 true 时，又分两种情况，图片在首屏和不在首屏中。在首屏中的图片会在 v-img 指令的 inserted 钩子函数中加载，非首屏的图片将等待参数 defer 配置为 false 的图片和首屏中图片都加载完全后才加载。
- delay 参数是延迟加载最大等待时长，默认值 **5000ms**。
- 图片 lazy load 的含义，监听滚动事件，当图片出现在视窗中，才去加载图片。我们可以通过 viewOffset 参数来对视窗高度进行偏移，viewOffset 的默认值为0。**懒加载功能仅支持 IMG 元素**。

## 贡献代码

```bash
npm install  # 安装依赖
npm run dev  # 构建文件
npm run test # 单元测试
```

- 提交代码前请确保已通过测试。
- 更多细节请参考[《饿了么开源项目贡献指南》](https://github.com/ElemeFE/vue-img/blob/master/.github/CONTRIBUTING_zh-cn.md)。

## 开源协议

MIT
