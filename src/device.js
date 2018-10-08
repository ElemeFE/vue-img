const ua = window.navigator.userAgent

const isIOS = /iphone|ios|ipad|ipod/i.test(ua)

const isAlipay = /AliApp\(AP\/([\d.]+)\)/i.test(ua)

const compareAlipayVersion = (targetVersion) => {
  let version = ua.match(/AlipayClient[a-zA-Z]*\/(\d+(?:\.\d+)+)/)
  version = version && version.length ? version[1] : ''
  version = version.split('.')

  targetVersion = targetVersion.split('.')
  for (let i = 0, n1, n2; i < version.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0
    n2 = parseInt(version[i], 10) || 0
    if (n1 > n2) return -1
    if (n1 < n2) return 1
  }

  return 0
}

export const checkSupport = () => {
  // only support since 10.1.0
  return isIOS && isAlipay && compareAlipayVersion('10.1.0') >= 0
}
