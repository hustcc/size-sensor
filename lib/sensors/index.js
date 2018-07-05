'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSensor = undefined;

var _object = require('./object');

var _resizeObserver = require('./resizeObserver');

/**
 * 传感器使用策略
 */
/**
 * Created by hustcc on 18/7/5.
 * Contract: i@hust.cc
 */

var createSensorFunc = function createSensorFunc() {
  return typeof ResizeObserver !== 'undefined' ? _resizeObserver.createSensor : _object.createSensor;
};

var createSensor = exports.createSensor = createSensorFunc();