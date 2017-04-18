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

// Get image size
var getSize = function (width, height) {
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
  var prefix = ref.prefix;
  var suffix = ref.suffix;
  var quality = ref.quality;
  var disableWebp = ref.disableWebp;

  if (!hash || typeof hash !== 'string') { return '' }

  var _prefix = typeof prefix === 'string' ? prefix : VueImg$1.cdn;
  var _suffix = typeof suffix === 'string' ? suffix : '';
  var _quality = typeof quality === 'number' ? ("quality/" + quality + "/") : '';
  var _format = !disableWebp && VueImg$1.canWebp ? 'format/webp/' : '';
  var params = "" + _quality + _format + (getSize(width, height)) + _suffix;

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

var getImageClass = function (opt) {
  if ( opt === void 0 ) opt = {};

  var GlobalOptions = function GlobalOptions() {
    copyKeys({
      source: opt,
      target: this,
      keys: [
        'loading', 'error',
        'quality',
        'prefix', 'suffix',
        'disableWebp',
      ],
    });
  };

  GlobalOptions.prototype.hashToSrc = function hashToSrc (hash) {
    var params = { hash: hash };

    copyKeys({
      source: this,
      target: params,
      keys: [
        'width', 'height', 'quality',
        'prefix', 'suffix',
        'disableWebp',
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
      copyKeys({
        source: params,
        target: this,
        keys: [
          'hash', 'loading', 'error',
          'width', 'height', 'quality',
          'prefix', 'suffix',
          'disableWebp',
        ],
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

  // Register Vue directive
  Vue.directive('img', {
    bind: function bind(el, binding, vnode) {
      var src = new vImg(binding.value).toLoadingSrc();
      if (src) { setAttr(el, src, vnode.tag); }
      update(el, binding, vnode);
    },

    update: update,
  });
};

VueImg$1.getSrc = getSrc;
VueImg$1.install = install;

return VueImg$1;

})));
