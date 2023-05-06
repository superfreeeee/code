'use strict'

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }
  return _setPrototypeOf(o, p)
}

var A = function A() {
  this.name = 'A'
}

var B = /*#__PURE__*/ (function (_A) {
  _inheritsLoose(B, _A)

  function B() {
    var _this

    _this = _A.call(this) || this
    _this.name = 'B'
    return _this
  }

  return B
})(A)
