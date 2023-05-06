'use strict';

/**
 * 文件大小格式化
 * @param {*} stat 
 * @param {*} humanReadable 
 * @param {*} si 
 * @returns 
 */
// ? Read
// given a file's stat, return the size of it in string
// humanReadable: (boolean) whether to result is human readable
// si: (boolean) whether to use si (1k = 1000), otherwise 1k = 1024
// adopted from http://stackoverflow.com/a/14919494/665507
module.exports = function sizeToString(stat, humanReadable, si) {
  // 目录不打印大小
  if (stat.isDirectory && stat.isDirectory()) {
    return '';
  }

  let bytes = stat.size;
  const threshold = si ? 1000 : 1024; // 单位

  // B
  if (!humanReadable || bytes < threshold) {
    return `${bytes}B`;
  }

  // B 以上
  const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let u = -1;
  do {
    bytes /= threshold;
    u += 1;
  } while (bytes >= threshold);

  let b = bytes.toFixed(1);
  if (isNaN(b)) b = '??';

  // 取最大单位
  return b + units[u];
};
