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

const throttle = (action, delay) => {
  let timeout = null;
  let lastRun = 0;
  return function() {
    if (timeout) {
      return
    }
    const elapsed = Date.now() - lastRun;
    const context = this;
    const args = arguments;
    const runCallback = function() {
      lastRun = Date.now();
      timeout = false;
      action.apply(context, args);
    };
    if (elapsed >= delay) {
      runCallback();
    } else {
      timeout = setTimeout(runCallback, delay);
    }
  }
};

const on = (el, ev, fn) => {
  el.addEventListener(ev, fn);
};

const off = (el, ev, fn) => {
  el.removeEventListener(ev, fn);
};

const inView = (el) => {
  const rect = el.getBoundingClientRect();

  return rect.top < window.innerHeight
  && rect.bottom > 0
  && rect.left < window.innerWidth
  && rect.right > 0
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

const LAZY_CLASS = 'v-jo-lazy';
const EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'touchmove'];


var constants = Object.freeze({
	LAZY_CLASS: LAZY_CLASS,
	EVENTS: EVENTS
});

let hasBind = false;

const { EVENTS: EVENTS$1, LAZY_CLASS: LAZY_CLASS$1 } = constants;

const loadImage = (item) => {
  const img = new Image();
  img.src = item.dataset.src;

  img.onload = () => {
    item.src = item.dataset.src;
    item.classList.remove(LAZY_CLASS$1);
  };
};

const handler = throttle(() => {

  const lazys = document.querySelectorAll(`img.${LAZY_CLASS$1}`);
  const len = lazys.length;

  if (len > 0) {
    lazys.forEach(lazy => {
      if (inView(lazy)) {
        loadImage(lazy);
      }
    });
  }

}, 200);

const events = (el, bool) => {
  EVENTS$1.forEach(ev => {
    bool
    ? on(el, ev, handler)
    : off(el, ev, handler);
  });
};

const lazy = bool => {
  if (!typeof window || hasBind) return false
  if (bool && !hasBind) hasBind = true;
  events(window, bool);
};

// Vue plugin installer
const install = (Vue, opt) => {
  const vImg = getImageClass(opt);
  const { globalLazy } = opt;
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

  globalLazy && lazy(true);

  // Register Vue directive
  Vue.directive('img', {
    bind(el, binding, vnode) {
      const vImgIns = new vImg(binding.value);
      const loadSrc = vImgIns.toLoadingSrc();
      const dataSrc = vImgIns.toImageSrc();
      const { lazy: lazy$$1 } = binding.value;

      if (loadSrc) setAttr(el, loadSrc, vnode.tag);

      if (lazy$$1 === true && globalLazy === true) {
        el.classList.add(LAZY_CLASS);
        el.setAttribute('data-src', dataSrc);
      } else {
        update(el, binding, vnode);       
      }
    },

    inserted(el, binding, vnode) {
      const { lazy: lazy$$1 } = binding.value;

      if (inView(el) && lazy$$1 === true && globalLazy === true) {
        update(el, binding, vnode);
      }
    },

    update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;
VueImg$1.lazy = lazy;

export default VueImg$1;
