(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueImg = factory());
}(this, (function () { 'use strict';

var ua = window.navigator.userAgent;

var isIOS = /iphone|ios|ipad|ipod/i.test(ua);

var isAlipay = /AliApp\(AP\/([\d.]+)\)/i.test(ua);

var compareAlipayVersion = function (targetVersion) {
  var version = ua.match(/AlipayClient[a-zA-Z]*\/(\d+(?:\.\d+)+)/);
  version = version && version.length ? version[1] : '';
  version = version.split('.');

  targetVersion = targetVersion.split('.');
  for (var i = 0, n1 = (void 0), n2 = (void 0); i < version.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(version[i], 10) || 0;
    if (n1 > n2) { return -1 }
    if (n1 < n2) { return 1 }
  }

  return 0
};

var checkSupport = function () {
  // only support since 10.1.0
  return isIOS && isAlipay && compareAlipayVersion('10.1.0') >= 0
};

var VueImg$1 = Object.create(null);

// Check webP support
VueImg$1.canWebp = checkSupport() || (!![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);

// Default cdn prefix
var protocol = location.protocol === 'https:' ? 'https://' : 'http://';
var env = document.domain.match(/.(alpha|beta|ar).ele(net)?.me$/);
VueImg$1.cdn = VueImg$1.qiniuCdn = protocol + (env ? ("fuss" + (env[0])) : 'fuss10.elemecdn.com');
VueImg$1.aliCdn = protocol + (env ? ("cube" + (env[0])) : 'cube.elemecdn.com');

var hasProp = function (obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); };
var html = document.documentElement;

var copyKeys = function (ref) {
  var source = ref.source;
  var target = ref.target;
  var keys = ref.keys;

  keys.forEach(function (key) {
    if (hasProp(source, key)) {
      target[key] = source[key];
    }
  });
};

var setAttr = function (el, src, tag) {
  if (tag === 'img') {
    el.src = src;
  } else {
    el.style.backgroundImage = "url('" + src + "')";
  }
};

var resize = function (size) {
  var viewWidth;
  var dpr = window.devicePixelRatio;
  var dataDpr = document.documentElement.getAttribute('data-dpr');
  var ratio = dataDpr ? (dpr / dataDpr) : dpr;

  try {
    viewWidth = +(html.getAttribute('style').match(/(\d+)/) || [])[1];
  } catch(e) {
    var w = html.offsetWidth;
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

var inViewport = function (el) {
  var rect = el.getBoundingClientRect();

  return rect.top > 0
    && rect.bottom < window.innerHeight
    && rect.left > 0
    && rect.right < window.innerWidth
};

// Translate hash to path
var hashToPath = function (hash) { return hash.replace(/^(\w)(\w\w)(\w{29}(\w*))$/, '/$1/$2/$3.$4'); };

// Get image format
var getFormat = function (ref) {
  var format = ref.format;
  var fallback = ref.fallback;

  var isFormat = /^(jpg|jpeg|png|gif)$/;

  if (isFormat.test(format)) { return ("format/" + format + "/") }
  if (VueImg$1.canWebp) { return 'format/webp/' }
  return isFormat.test(fallback)
    ? ("format/" + fallback + "/")
    : ''
};

// Get image size
var getSize = function (ref) {
  var width = ref.width;
  var height = ref.height;
  var adapt = ref.adapt;


  var w = width && (adapt ? resize(width) : width);
  var h = height && (adapt ? resize(height) : height);

  var thumb = 'thumbnail/';
  var cover = w + "x" + h;

  if (width && height) { return (thumb + "!" + cover + "r/gravity/Center/crop/" + cover + "/") }
  if (width) { return ("" + thumb + w + "x/") }
  if (height) { return (thumb + "x" + h + "/") }

  return ''
};

var getAliSize = function (ref) {
  var width = ref.width;
  var height = ref.height;
  var adapt = ref.adapt;

  var w = width && (adapt ? resize(width) : width);
  var h = height && (adapt ? resize(height) : height);
  if (typeof w === 'number') {
    w = Math.floor(w);
  }
  if (typeof h === 'number') {
    h = Math.floor(h);
  }
  if (width && height) { return ("/resize,w_" + w + ",h_" + h + ",m_fixed") }
  if (width) { return ("/resize,w_" + w) }
  if (height) { return ("/resize,h_" + h) }
  return ''
};

var getAliFormat = function (ref) {
  var format = ref.format;
  var fallback = ref.fallback;

  var formatRule = /^(jpg|png|gif)$/;
  if (formatRule.test(format)) { return ("/format," + format) }
  // https://help.aliyun.com/document_detail/44704.html
  if (format === 'jpeg') { return '/format,jpg/interlace,1' }
  if (VueImg$1.canWebp) { return '/format,webp' }
  return formatRule.test(fallback) ? ("/format," + fallback) : ''
};


var getAliOssSrc = function (ref) {
  if ( ref === void 0 ) ref = {};
  var hash = ref.hash;
  var adapt = ref.adapt;
  var width = ref.width;
  var height = ref.height;
  var quality = ref.quality;
  var format = ref.format;
  var fallback = ref.fallback;
  var prefix = ref.prefix;
  var suffix = ref.suffix;
  var urlFormatter = ref.urlFormatter;

  var _prefix = typeof prefix === 'string' ? prefix : VueImg$1.aliCdn;
  var src = _prefix + hashToPath(hash);
  // 阿里只支持如下格式图片的处理
  var supportFormats = /(jpg|png|bmp|gif|webp|tiff)$/;
  if (supportFormats.test(hash)) {
    var _quality = typeof quality === 'number' ? ("/quality,q_" + quality) : '';
    var _size = getAliSize({ width: width, height: height, adapt: adapt });
    var _format = getAliFormat({ format: format, fallback: fallback });
    var _suffix = typeof suffix === 'string' ? suffix : '';
    var params = "" + _quality + _format + _size + _suffix;
    src += (params ? ("?x-oss-process=image" + params) : '');
  }
  if (typeof urlFormatter === 'function') { src = urlFormatter(src); }
  return src
};

var getQiniuSrc = function (ref) {
  if ( ref === void 0 ) ref = {};
  var hash = ref.hash;
  var adapt = ref.adapt;
  var width = ref.width;
  var height = ref.height;
  var quality = ref.quality;
  var format = ref.format;
  var fallback = ref.fallback;
  var prefix = ref.prefix;
  var suffix = ref.suffix;
  var urlFormatter = ref.urlFormatter;

  var _prefix = typeof prefix === 'string' ? prefix : VueImg$1.qiniuCdn;
  var _quality = typeof quality === 'number' ? ("quality/" + quality + "/") : '';
  var _format = getFormat({ format: format, fallback: fallback });
  var _size = getSize({ width: width, height: height, adapt: adapt });
  var _suffix = typeof suffix === 'string' ? suffix : '';
  var params = "" + _quality + _format + _size + _suffix;
  var src = _prefix + hashToPath(hash) + (params ? ("?imageMogr/" + params) : '');
  if (typeof urlFormatter === 'function') { src = urlFormatter(src); }
  return src
};


var getSrc = function (options) {
  if ( options === void 0 ) options = {};

  if (!options.hash || typeof options.hash !== 'string') { return '' }
  if (options.cdn === 'ali') {
    return getAliOssSrc(options)
  }
  return getQiniuSrc(options)
};

var getImageClass = function (opt) {
  if ( opt === void 0 ) opt = {};

  var GlobalOptions = function GlobalOptions() {
    // Global
    copyKeys({
      source: opt,
      target: this,
      keys: [
        'loading', 'error',
        'quality', 'delay',
        'prefix', 'suffix', 'adapt',
        'cdn' ],
    });
  };

  GlobalOptions.prototype.hashToSrc = function hashToSrc (hash) {
    var params = { hash: hash };
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
  };

  var vImg = (function (GlobalOptions) {
    function vImg(value) {
      var params = value && typeof value === 'object'
        ? value
        : { hash: value };

      GlobalOptions.call(this);
      // Directive
      copyKeys({
        source: params,
        target: this,
        keys: [
          'hash', 'loading', 'error',
          'width', 'height', 'quality',
          'format', 'fallback', 'adapt',
          'prefix', 'suffix', 'defer',
          'urlFormatter', 'cdn' ],
      });
    }

    if ( GlobalOptions ) vImg.__proto__ = GlobalOptions;
    vImg.prototype = Object.create( GlobalOptions && GlobalOptions.prototype );
    vImg.prototype.constructor = vImg;

    vImg.prototype.toImageSrc = function toImageSrc () {
      return this.hashToSrc(this.hash)
    };

    vImg.prototype.toLoadingSrc = function toLoadingSrc () {
      return this.hashToSrc(this.loading)
    };

    vImg.prototype.toErrorSrc = function toErrorSrc () {
      return this.hashToSrc(this.error)
    };

    return vImg;
  }(GlobalOptions));

  return vImg
};

// Vue plugin installer
var install = function (Vue, opt) {
  var vImg = getImageClass(opt);
  var promises = [];

  var update = function (el, binding, vnode) {
    var vImgIns = new vImg(binding.value);
    var vImgSrc = vImgIns.toImageSrc();
    var vImgErr = vImgIns.toErrorSrc();

    if (!vImgSrc) { return Promise.resolve() }

    var img = new Image();
    var delay = +vImgIns.delay || 5000;

    return new Promise(function (resolve) {
      img.onload = function () {
        setAttr(el, img.src, vnode.tag);
        resolve();
      };
      img.onerror = function () {
        // webp图片加载失败降级到普通图片
        // 兼容客户端处理webp失败的情况
        // 兼容阿里云的 webp 拼接格式（`/format,webp`）
        var webpReg = /format[/,]webp\/?/;
        if (webpReg.test(img.src)) {
          img.src = vImgSrc.replace(webpReg, '');
        } else if (vImgErr) {
          setAttr(el, vImgErr, vnode.tag);
          resolve();
        }
      };
      setTimeout(function () {
        resolve();
      }, delay);
      img.src = vImgSrc;
    })
  };

  // Register Vue directive
  Vue.directive('img', {
    bind: function bind(el, binding, vnode) {
      var loadSrc = new vImg(binding.value).toLoadingSrc();
      var ref = binding.value;
      var defer = ref.defer;

      if (loadSrc) { setAttr(el, loadSrc, vnode.tag); }
      if (!defer) {
        promises.push(update(el, binding, vnode));
      }
    },
    inserted: function inserted(el, binding, vnode) {
      var ref = binding.value;
      var defer = ref.defer;
      if (!defer) { return }
      if (inViewport(el)) {

        promises.push(update(el, binding, vnode));

      } else {

        Vue.nextTick(function () {
          Promise.all(promises)
          .then(function () {
            promises.length = 0;
            update(el, binding, vnode);
          })
          .catch(function () {});
        });

      }
    },
    update: update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;

return VueImg$1;

})));
