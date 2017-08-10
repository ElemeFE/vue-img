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
var env = document.domain.match(/.(alpha|beta).ele(net)?.me$/);
VueImg$1.cdn = protocol + (env ? ("fuss" + (env[0])) : 'fuss10.elemecdn.com');

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

  var thumb = 'thumbnail/';
  var cover = width + "x" + height;

  if (width && height) { return (thumb + "!" + cover + "r/gravity/Center/crop/" + cover + "/") }
  if (width) { return ("" + thumb + width + "x/") }
  if (height) { return (thumb + "x" + height + "/") }
  return ''
};

// Get image size
var getSrc = function (ref) {
  if ( ref === void 0 ) ref = {};
  var hash = ref.hash;
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
  var _size = getSize({ width: width, height: height });
  var _suffix = typeof suffix === 'string' ? suffix : '';
  var params = "" + _quality + _format + _size + _suffix;

  return _prefix + hashToPath(hash) + (params ? ("?imageMogr/" + params) : '')
};

var hasProp = function (obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); };

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

var throttle = function (action, delay) {
  var timeout = null;
  var lastRun = 0;
  return function() {
    if (timeout) {
      return
    }
    var elapsed = Date.now() - lastRun;
    var context = this;
    var args = arguments;
    var runCallback = function() {
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

var on = function (el, ev, fn) {
  el.addEventListener(ev, fn);
};

var off = function (el, ev, fn) {
  el.removeEventListener(ev, fn);
};

var inView = function (el) {
  var rect = el.getBoundingClientRect();

  return rect.top < window.innerHeight
  && rect.bottom > 0
  && rect.left < window.innerWidth
  && rect.right > 0
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
        'quality',
        'prefix', 'suffix' ],
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
        'format', 'fallback',
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
          'format', 'fallback',
          'prefix', 'suffix' ],
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

var LAZY_CLASS = 'v-jo-lazy';
var EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'touchmove'];

var hasBind = false;

var EVENTS$1 = EVENTS;
var LAZY_CLASS$1 = LAZY_CLASS;

var loadImage = function (item) {
  var img = new Image();
  img.src = item.dataset.src;

  img.onload = function () {
    item.src = item.dataset.src;
    item.classList.remove(LAZY_CLASS$1);
  };
};

var handler = throttle(function () {

  var lazys = document.querySelectorAll(("img." + LAZY_CLASS$1));
  var len = lazys.length;

  if (len > 0) {
    lazys.forEach(function (lazy) {
      if (inView(lazy)) {
        loadImage(lazy);
      }
    });
  }

}, 200);

var events = function (el, bool) {
  EVENTS$1.forEach(function (ev) {
    bool
    ? on(el, ev, handler)
    : off(el, ev, handler);
  });
};

var lazy = function (bool) {
  if (!typeof window || hasBind) { return false }
  if (bool && !hasBind) { hasBind = true; }
  events(window, bool);
};

// Vue plugin installer
var install = function (Vue, opt) {
  var vImg = getImageClass(opt);
  var globalLazy = opt.globalLazy;
  var update = function (el, binding, vnode) {
    var vImgIns = new vImg(binding.value);
    var vImgSrc = vImgIns.toImageSrc();
    var vImgErr = vImgIns.toErrorSrc();
    if (!vImgSrc) { return }

    var img = new Image();
    img.onload = function () {
      setAttr(el, vImgSrc, vnode.tag);
    };
    if (vImgErr) {
      img.onerror = function () {
        setAttr(el, vImgErr, vnode.tag);
      };
    }
    img.src = vImgSrc;
  };

  globalLazy && lazy(true);

  // Register Vue directive
  Vue.directive('img', {
    bind: function bind(el, binding, vnode) {
      var vImgIns = new vImg(binding.value);
      var loadSrc = vImgIns.toLoadingSrc();
      var dataSrc = vImgIns.toImageSrc();
      var ref = binding.value;
      var lazy$$1 = ref.lazy;

      if (loadSrc) { setAttr(el, loadSrc, vnode.tag); }

      if (lazy$$1 === true && globalLazy === true) {
        el.classList.add(LAZY_CLASS);
        el.setAttribute('data-src', dataSrc);
      } else {
        update(el, binding, vnode);       
      }
    },

    inserted: function inserted(el, binding, vnode) {
      var ref = binding.value;
      var lazy$$1 = ref.lazy;

      if (inView(el) && lazy$$1 === true && globalLazy === true) {
        update(el, binding, vnode);
      }
    },

    update: update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;
VueImg$1.lazy = lazy;

return VueImg$1;

})));
