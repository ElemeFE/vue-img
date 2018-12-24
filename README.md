# vue-img

> hash2path wrapper for vue 2, also surport image delay load and image size adaptation for various devices.

## 使用方法

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
  adapt: true,
  delay: 2000, // 单位ms,
  cdn: 'qiniu' // 选择要使用的 CDN 服务提供商，目前仅支持 `ali` 和 `qiniu`，默认为 'qiniu'
})
```

### 使用指令

#### 基本用法

> 由于 Vue 2 删除了指令中的 params，故采用 object value 的形式传入参数

```HTML
<!-- 设置图片 + 默认参数 -->
<img v-img="'xxx'">
<!-- 设置图片 + 自定义参数 -->
<img v-img="{ hash: 'xxx', width: 233, height: 666, defer: true, adapt: false }">

<!-- 设置背景 + 默认参数 -->
<div v-img="'xxx'"></div>
<!-- 设置背景 + 自定义参数 -->
<div v-img="{ hash: 'xxx', width: 12, height: 450 }"></div>
```

### 可读属性

VueImg 提供了一些属性，可用于指令以外的场合。你应当视它们为**只读**属性，避免直接修改。

```JS
VueImg.cdn             // [String]   当前环境所使用的 CDN 的域名，例如 http://cube.elemecdn.com
VueImg.cdnProvider     // [String]   当前环境所使用的 CDN 服务提供商，目前仅支持 `ali` 和 `qiniu`，默认为 'qiniu'。
VueImg.canWebp         // [Boolean]  当前环境是否支持 webP
VueImg.getSrc({ ... }) // [Function] 获取图片地址
```

### 参数列表

| 名称       | 描述                        | 全局配置 | 指令参数 | getSrc 函数 |
| -------- | ------------------------- | :--: | :--: | :-------: |
| hash     | [String] 图片哈希（必填）         |  ✕   |  〇   |     〇     |
| width    | [Number] 宽度               |  ✕   |  〇   |     〇     |
| height   | [Number] 高度               |  ✕   |  〇   |     〇     |
| format   | [String] 强制图片格式           |  ✕   |  〇   |     〇     |
| fallback | [String] 不支持 webP 时转换格式   |  ✕   |  〇   |     〇     |
| quality  | [Number] 图片质量             |  〇   |  〇   |     〇     |
| prefix   | [String] CDN 地址前缀         |  〇   |  〇   |     〇     |
| suffix   | [String] CDN 处理后缀 [?]     |  〇   |  〇   |     〇     |
| loading  | [String] 加载中默认图片哈希        |  〇   |  〇   |     ✕     |
| error    | [String] 失败替换图片哈希         |  〇   |  〇   |     ✕     |
| adapt    | [Boolean] 图片尺寸是否适配设备屏幕    |  〇   |  〇   |     〇     |
| delay    | [Number] 设置延迟加载最大等待时长（ms） |  〇   |  ✕   |     ✕     |
| defer     | [Boolean] 图片是否进行延迟加载      |  ✕   |  〇   |     ✕     |
| urlFormatter | [Function] 修改 v-img 生成的 url |  ✕   |  〇   |     〇    |
| cdn     | [String] 图片服务提供商         |  〇   |  ✕   |     ✕     |

- `suffix` 参数可用于模糊、旋转等特殊处理，具体请参考[《七牛 CDN 开发者文档》](http://developer.qiniu.com/code/v6/api/kodo-api/image/imagemogr2.html)。
- `adapt`图片尺寸是否适配设备屏幕大小，指令参数会覆盖全局配置，例如：当全局配置`adapt: true`时，指令参数`adpat: false`，那么该图片不会根据设备viewport调整尺寸。
- `defer`延迟加载的含义，当`defer: false`时，图片在`v-img`指令的`bind`钩子函数中加载，当`defer: true`时，又分两种情况，图片在首屏和不在首屏中。在首屏中的图片会在`v-img`指令的`inserted`钩子函数中加载，非首屏的图片将等待`defer: false`和首屏中图片都加载完全后才加载。
- `delay`延迟加载最大等待时长，默认值**5000ms**。/
- `urlFormatter` 可以不依赖组件更新让 src 属性适配 CDN 源更新或者添加自定义参数，举例：七牛云的 imageMogr1 => imageMogr2。
- `cdn` 指定图片服务提供商，根据不同提供商将采取不同的 URL 拼接规则，只能在全局配置。目前仅支持 `ali` 和 `qiniu`，默认为 'qiniu'。

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
