(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueImg = factory());
}(this, (function () { 'use strict';

var VueImg$1 = Object.create(null);

// Check webP support
VueImg$1.canWebp = false;
var img = new Image();
img.onload = function () { VueImg$1.canWebp = true; };
img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';

// Default cdn prefix
var protocol = location.protocol === 'https:' ? 'https://' : 'http://';
var env = document.domain.match(/.(alpha|beta|ar).ele(net)?.me$/);
VueImg$1.cdn = protocol + (env ? ("fuss" + (env[0])) : 'fuss10.elemecdn.com');

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

// Get image size
var getSrc = function (ref) {
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

  if (!hash || typeof hash !== 'string') { return '' }

  var _prefix = typeof prefix === 'string' ? prefix : VueImg$1.cdn;
  var _quality = typeof quality === 'number' ? ("quality/" + quality + "/") : '';
  var _format = getFormat({ format: format, fallback: fallback });
  var _size = getSize({ width: width, height: height, adapt: adapt });
  var _suffix = typeof suffix === 'string' ? suffix : '';
  var params = "" + _quality + _format + _size + _suffix;

  return _prefix + hashToPath(hash) + (params ? ("?imageMogr/" + params) : '')
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
        'prefix', 'suffix', 'adapt' ],
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
        'prefix', 'suffix' ],
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
          'prefix', 'suffix', 'defer' ],
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
        setAttr(el, vImgSrc, vnode.tag);
        resolve();
      };
      if (vImgErr) {
        img.onerror = function () {
          setAttr(el, vImgErr, vnode.tag);
          resolve();
        };
      }
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
