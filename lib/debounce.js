"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

exports.default = function (fn) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

  var timer = null;

  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timer);

    timer = setTimeout(function () {
      fn.apply(_this, args);
    }, delay);
  };
};

module.exports = exports["default"];