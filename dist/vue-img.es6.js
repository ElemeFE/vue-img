const ua = window.navigator.userAgent;

const isIOS = /iphone|ios|ipad|ipod/i.test(ua);

const isAlipay = /AliApp\(AP\/([\d.]+)\)/i.test(ua);

const compareAlipayVersion = (targetVersion) => {
  let version = ua.match(/AlipayClient[a-zA-Z]*\/(\d+(?:\.\d+)+)/);
  version = version && version.length ? version[1] : '';
  version = version.split('.');

  targetVersion = targetVersion.split('.');
  for (let i = 0, n1, n2; i < version.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(version[i], 10) || 0;
    if (n1 > n2) return -1
    if (n1 < n2) return 1
  }

  return 0
};

const checkSupport = () => {
  // only support since 10.1.0
  return isIOS && isAlipay && compareAlipayVersion('10.1.0') >= 0
};

const VueImg$1 = Object.create(null);

// Check webP support
VueImg$1.canWebp = checkSupport() || (!![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);

// Default cdn prefix
const protocol = location.protocol === 'https:' ? 'https://' : 'http://';
const env = document.domain.match(/.(alpha|beta|ar).ele(net)?.me$/);
VueImg$1.cdn = VueImg$1.qiniuCdn = protocol + (env ? `fuss${env[0]}` : 'fuss10.elemecdn.com');
VueImg$1.aliCdn = protocol + (env ? `cube${env[0]}` : 'cube.elemecdn.com');

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const html = document.documentElement;

const copyKeys = ({ source, target, keys }) => {
  keys.forEach(key => {
    if (hasProp(source, key)) {
      target[key] = source[key];
    }
  });
};

const setAttr = (el, src, tag) => {
  if (tag === 'img') {
    el.src = src;
  } else {
    el.style.backgroundImage = `url('${src}')`;
  }
};

const resize = (size) => {
  let viewWidth;
  const dpr = window.devicePixelRatio;
  const dataDpr = document.documentElement.getAttribute('data-dpr');
  const ratio = dataDpr ? (dpr / dataDpr) : dpr;

  try {
    viewWidth = +(html.getAttribute('style').match(/(\d+)/) || [])[1];
  } catch(e) {
    const w = html.offsetWidth;
    if (w / dpr > 540) {
      viewWidth = 540 * dpr / 10;
    } else {
      viewWidth = w / 10;
    }
  }

  viewWidth = viewWidth * ratio;

  if (Number(viewWidth) >= 0 && typeof viewWidth === 'number') {
    return (size * viewWidth) / 75 // 75 is the 1/10 iphone6 deivce width pixel
  } else {
    return size
  }
};

const inViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return rect.top > 0
    && rect.bottom < window.innerHeight
    && rect.left > 0
    && rect.right < window.innerWidth
};

// Translate hash to path
const hashToPath = hash => hash.replace(/^(\w)(\w\w)(\w{29}(\w*))$/, '/$1/$2/$3.$4');

// Get image format
const getFormat = ({ format, fallback }) => {
  const isFormat = /^(jpg|jpeg|png|gif)$/;

  if (isFormat.test(format)) return `format/${format}/`
  if (VueImg$1.canWebp) return 'format/webp/'
  return isFormat.test(fallback)
    ? `format/${fallback}/`
    : ''
};

// Get image size
const getSize = ({ width, height, adapt }) => {

  const w = width && (adapt ? resize(width) : width);
  const h = height && (adapt ? resize(height) : height);

  const thumb = 'thumbnail/';
  const cover = `${w}x${h}`;

  if (width && height) return `${thumb}!${cover}r/gravity/Center/crop/${cover}/`
  if (width) return `${thumb}${w}x/`
  if (height) return `${thumb}x${h}/`

  return ''
};

const getAliSize = ({ width, height, adapt }) => {
  let w = width && (adapt ? resize(width) : width);
  let h = height && (adapt ? resize(height) : height);
  if (typeof w === 'number') {
    w = Math.floor(w);
  }
  if (typeof h === 'number') {
    h = Math.floor(h);
  }
  if (width && height) return `/resize,w_${w},h_${h},m_fixed`
  if (width) return `/resize,w_${w}`
  if (height) return `/resize,h_${h}`
  return ''
};

const getAliFormat = ({ format, fallback }) => {
  const formatRule = /^(jpg|png|gif)$/;
  if (formatRule.test(format)) return `/format,${format}`
  // https://help.aliyun.com/document_detail/44704.html
  if (format === 'jpeg') return '/format,jpg/interlace,1'
  if (VueImg$1.canWebp) return '/format,webp'
  return formatRule.test(fallback) ? `/format,${fallback}` : ''
};


const getAliOssSrc = ({
  hash, adapt,
  width, height, quality,
  format, fallback,
  prefix, suffix,
  urlFormatter,
} = {}) => {
  const _prefix = typeof prefix === 'string' ? prefix : VueImg$1.aliCdn;
  let src = _prefix + hashToPath(hash);
  // 阿里只支持如下格式图片的处理
  const supportFormats = /(jpg|png|bmp|gif|webp|tiff)$/;
  if (supportFormats.test(hash)) {
    const _quality = typeof quality === 'number' ? `/quality,q_${quality}` : '';
    const _size = getAliSize({ width, height, adapt });
    const _format = getAliFormat({ format, fallback });
    const _suffix = typeof suffix === 'string' ? suffix : '';
    const params = `${_quality}${_format}${_size}${_suffix}`;
    src += (params ? `?x-oss-process=image${params}` : '');
  }
  if (typeof urlFormatter === 'function') src = urlFormatter(src);
  return src
};

const getQiniuSrc = ({
  hash, adapt,
  width, height, quality,
  format, fallback,
  prefix, suffix,
  urlFormatter,
} = {}) => {
  const _prefix = typeof prefix === 'string' ? prefix : VueImg$1.qiniuCdn;
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : '';
  const _format = getFormat({ format, fallback });
  const _size = getSize({ width, height, adapt });
  const _suffix = typeof suffix === 'string' ? suffix : '';
  const params = `${_quality}${_format}${_size}${_suffix}`;
  let src = _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '');
  if (typeof urlFormatter === 'function') src = urlFormatter(src);
  return src
};


var getSrc = (options = {}) => {
  if (!options.hash || typeof options.hash !== 'string') return ''
  if (options.cdn === 'ali') {
    return getAliOssSrc(options)
  }
  return getQiniuSrc(options)
};

var getImageClass = (opt = {}) => {
  class GlobalOptions {
    constructor() {
      // Global
      copyKeys({
        source: opt,
        target: this,
        keys: [
          'loading', 'error',
          'quality', 'delay',
          'prefix', 'suffix', 'adapt',
          'cdn',
        ],
      });
    }

    hashToSrc(hash) {
      const params = { hash };
      // Get src
      copyKeys({
        source: this,
        target: params,
        keys: [
          'width', 'height', 'quality',
          'format', 'fallback', 'adapt',
          'prefix', 'suffix', 'cdn'
        ],
      });
      return getSrc(params)
    }
  }

  class vImg extends GlobalOptions {
    constructor(value) {
      const params = value && typeof value === 'object'
        ? value
        : { hash: value };

      super();
      // Directive
      copyKeys({
        source: params,
        target: this,
        keys: [
          'hash', 'loading', 'error',
          'width', 'height', 'quality',
          'format', 'fallback', 'adapt',
          'prefix', 'suffix', 'defer',
          'urlFormatter', 'cdn',
        ],
      });
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
};

// Vue plugin installer
const install = (Vue, opt) => {
  const vImg = getImageClass(opt);
  const promises = [];

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value);
    const vImgSrc = vImgIns.toImageSrc();
    const vImgErr = vImgIns.toErrorSrc();

    if (!vImgSrc) return Promise.resolve()

    const img = new Image();
    const delay = +vImgIns.delay || 5000;

    return new Promise(resolve => {
      img.onload = () => {
        setAttr(el, img.src, vnode.tag);
        resolve();
      };
      img.onerror = () => {
        // webp图片加载失败降级到普通图片
        // 兼容客户端处理webp失败的情况
        // 兼容阿里云的 webp 拼接格式（`/format,webp`）
        const webpReg = /format[/,]webp\/?/;
        if (webpReg.test(img.src)) {
          img.src = vImgSrc.replace(webpReg, '');
        } else if (vImgErr) {
          setAttr(el, vImgErr, vnode.tag);
          resolve();
        }
      };
      setTimeout(() => {
        resolve();
      }, delay);
      img.src = vImgSrc;
    })
  };

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const loadSrc = new vImg(binding.value).toLoadingSrc();
      const { defer } = binding.value;

      if (loadSrc) setAttr(el, loadSrc, vnode.tag);
      if (!defer) {
        promises.push(update(el, binding, vnode));
      }
    },
    inserted(el, binding, vnode) {
      const { defer } = binding.value;
      if (!defer) return
      if (inViewport(el)) {

        promises.push(update(el, binding, vnode));

      } else {

        Vue.nextTick(() => {
          Promise.all(promises)
          .then(() => {
            promises.length = 0;
            update(el, binding, vnode);
          })
          .catch(() => {});
        });

      }
    },
    update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;

export default VueImg$1;
