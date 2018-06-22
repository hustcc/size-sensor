"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by hustcc on 18/6/22.
 * Contract: i@hust.cc
 */

/**
 * 是否是 ie，对于 ie 这种东西需要有额外处理！
 * @returns {RegExpMatchArray | null}
 */
var isIE = exports.isIE = function isIE() {
  return navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/);
};