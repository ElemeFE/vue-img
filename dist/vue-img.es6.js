const VueImg$1 = Object.create(null);

// Check webP support
VueImg$1.canWebp = false;
const img = new Image();
img.onload = () => { VueImg$1.canWebp = true; };
img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';

// Default cdn prefix
const protocol = location.protocol === 'https:' ? 'https://' : 'http://';
const env = document.domain.match(/.(alpha|beta).ele(net)?.me$/);
VueImg$1.cdn = protocol + (env ? `fuss${env[0]}` : 'fuss10.elemecdn.com');

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
const getSize = ({ width, height }) => {
  const thumb = 'thumbnail/';
  const cover = `${width}x${height}`;

  if (width && height) return `${thumb}!${cover}r/gravity/Center/crop/${cover}/`
  if (width) return `${thumb}${width}x/`
  if (height) return `${thumb}x${height}/`
  return ''
};

// Get image size
const getSrc = ({
  hash,
  width, height, quality,
  format, fallback,
  prefix, suffix,
} = {}) => {
  if (!hash || typeof hash !== 'string') return ''

  const _prefix = typeof prefix === 'string' ? prefix : VueImg$1.cdn;
  const _quality = typeof quality === 'number' ? `quality/${quality}/` : '';
  const _format = getFormat({ format, fallback });
  const _size = getSize({ width, height });
  const _suffix = typeof suffix === 'string' ? suffix : '';
  const params = `${_quality}${_format}${_size}${_suffix}`;

  return _prefix + hashToPath(hash) + (params ? `?imageMogr/${params}` : '')
};

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

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

var getImageClass = (opt = {}) => {
  class GlobalOptions {
    constructor() {
      // Global
      copyKeys({
        source: opt,
        target: this,
        keys: [
          'loading', 'error',
          'quality',
          'prefix', 'suffix',
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
          'format', 'fallback',
          'prefix', 'suffix',
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
          'format', 'fallback',
          'prefix', 'suffix',
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

  const update = (el, binding, vnode) => {
    const vImgIns = new vImg(binding.value);
    const vImgSrc = vImgIns.toImageSrc();
    const vImgErr = vImgIns.toErrorSrc();
    if (!vImgSrc) return

    const img = new Image();
    img.onload = () => {
      setAttr(el, vImgSrc, vnode.tag);
    };
    if (vImgErr) {
      img.onerror = () => {
        setAttr(el, vImgErr, vnode.tag);
      };
    }
    img.src = vImgSrc;
  };

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const src = new vImg(binding.value).toLoadingSrc();
      if (src) setAttr(el, src, vnode.tag);
      update(el, binding, vnode);
    },

    update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;

export default VueImg$1;
