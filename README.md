# vue-img

> hash2path wrapper for vue 2

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
  quality: 100
})
```

### 使用指令

#### 基本用法

> 由于 Vue 2 删除了指令中的 params，故采用 object value 的形式传入参数

```HTML
<!-- 设置图片 + 默认参数 -->
<img v-img="'xxx'">
<!-- 设置图片 + 自定义参数 -->
<img v-img="{ hash: 'xxx', width: 233, height: 666 }">

<!-- 设置背景 + 默认参数 -->
<div v-img="'xxx'"></div>
<!-- 设置背景 + 自定义参数 -->
<div v-img="{ hash: 'xxx', width: 12, height: 450 }"></div>
```

### 可读属性

VueImg 提供了一些属性，可用于指令以外的场合。你应当视它们为**只读**属性，避免直接修改。

```JS
VueImg.cdn             // [String]   当前环境的默认 CDN
VueImg.canWebp         // [Boolean]  当前环境是否支持 webP
VueImg.getSrc({ ... }) // [Function] 获取图片地址
```

### 参数列表

名称 | 描述 | 全局配置 | 指令参数 | getSrc 函数
--- | --- | --- | --- | ---
hash | [String] 图片哈希（必填）| ✕ | 〇 | 〇
width | [Number] 宽度 | ✕ | 〇 | 〇
height | [Number] 高度 | ✕ | 〇 | 〇
format | [String] 强制图片格式 | ✕ | 〇 | 〇
fallback | [String] 不支持 webP 时转换格式 | ✕ | 〇 | 〇
quality | [Number] 图片质量 | 〇 | 〇 | 〇
prefix | [String] CDN 地址前缀 | 〇 | 〇 | 〇
suffix | [String] CDN 处理后缀 [?] | 〇 | 〇 | 〇
loading | [String] 加载中默认图片哈希 | 〇 | 〇 | ✕
error | [String] 失败替换图片哈希 | 〇 | 〇 | ✕

- `suffix` 参数可用于模糊、旋转等特殊处理，具体请参考[《七牛 CDN 开发者文档》](http://developer.qiniu.com/code/v6/api/kodo-api/image/imagemogr2.html)。

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
