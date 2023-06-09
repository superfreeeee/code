const SemVer = require('../classes/semver');
const parse = require('./parse');
const { re, t } = require('../internal/re');

/**
 * 解析核心 version，返回 SemVer 对象
 * @param {*} version
 * @param {*} options
 * @returns
 */
// ? Read
const coerce = (version, options) => {
  if (version instanceof SemVer) {
    // 直接返回
    return version;
  }

  if (typeof version === 'number') {
    version = String(version);
  }

  if (typeof version !== 'string') {
    return null;
  }

  options = options || {};

  // ========== 参数解析 ==========

  let match = null;
  if (!options.rtl) {
    match = version.match(re[t.COERCE]);
  } else {
    // rtl 模式
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next;
    while (
      (next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (
        !match ||
        next.index + next[0].length !== match.index + match[0].length
      ) {
        // 从右匹配找到第一个符合条件的
        match = next;
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
    }
    // leave it in a clean state
    // 重置 lastIndex
    re[t.COERCERTL].lastIndex = -1;
  }

  if (match === null) return null;

  // major(2).minor(3).patch(4)
  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options);
};
module.exports = coerce;
