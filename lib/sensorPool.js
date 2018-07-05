'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSensor = exports.getSensor = undefined;

var _id = require('./id');

var _id2 = _interopRequireDefault(_id);

var _sensors = require('./sensors');

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * all the sensor objects.
 * 传感器池子
 */
var Sensors = {};

/**
 * 获取 sensor
 * @param element
 * @returns {*}
 */
/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

var getSensor = exports.getSensor = function getSensor(element) {
  var sensorId = element.getAttribute(_constant.SizeSensorId);

  // 1. 已经存在，则直接取这个 sensor
  if (sensorId && Sensors[sensorId]) {
    return Sensors[sensorId];
  }

  // 2. 不存在则创建
  var newId = (0, _id2.default)();
  element.setAttribute(_constant.SizeSensorId, newId);

  var sensor = (0, _sensors.createSensor)(element);
  // 添加到池子中
  Sensors[newId] = sensor;

  return sensor;
};

/**
 * 移除 sensor
 * @param sensor
 */
var removeSensor = exports.removeSensor = function removeSensor(sensor) {
  var sensorId = sensor.element.getAttribute(_constant.SizeSensorId);

  // 移除 attribute
  sensor.element.removeAttribute(_constant.SizeSensorId);
  // 移除 sensor 对应的 事件 和 dom 结构
  sensor.destroy();

  // 存在则从 pool 中移除
  if (sensorId && Sensors[sensorId]) {
    delete Sensors[sensorId];
  }
};