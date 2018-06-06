'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = exports.bind = undefined;

var _sensorPool = require('./sensorPool');

/**
 * 对外暴露的 bind 方法
 * @param {*} element
 * @param {*} cb
 */
var bind = exports.bind = function bind(element, cb) {
  var sensor = (0, _sensorPool.getSensor)(element);

  // 绑定新的方法
  sensor.bind(cb);

  // 返回 unbind 方法
  return function () {
    sensor.unbind(cb);
  };
};

/**
 * 清空一个 element 中的所有监听
 * @param element
 */
/**
 * Created by hustcc on 18/6/9.[高考时间]
 * Contract: i@hust.cc
 */

var clear = exports.clear = function clear(element) {
  var sensor = (0, _sensorPool.getSensor)(element);

  (0, _sensorPool.removeSensor)(sensor);
};