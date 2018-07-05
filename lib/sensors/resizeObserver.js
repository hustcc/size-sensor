'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSensor = undefined;

var _debounce = require('../debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSensor = exports.createSensor = function createSensor(element) {
  // 感应器
  var sensor = undefined;
  // callback
  var listeners = [];

  /**
   * 统一触发 listeners
   */
  var resizeListener = (0, _debounce2.default)(function () {
    // 依次触发执行
    listeners.forEach(function (listener) {
      listener(element);
    });
  });

  /**
   * 创建 sensor 的 object DOM
   * @returns {HTMLObjectElement}
   */
  var newSensor = function newSensor() {
    var sensor = new ResizeObserver(resizeListener);
    // 监听 element
    sensor.observe(element);

    // 直接触发一次
    resizeListener();
    return sensor;
  };

  /**
   * 监听某一个 callback
   * @param cb
   */
  var bind = function bind(cb) {
    if (!sensor) {
      sensor = newSensor();
    }

    if (listeners.indexOf(cb) === -1) {
      listeners.push(cb);
    }
  };

  /**
   * 完全 destroy
   */
  var destroy = function destroy() {
    sensor.disconnect();

    listeners = [];
    sensor = undefined;
  };

  /**
   * 取消绑定
   * @param cb
   */
  var unbind = function unbind(cb) {
    var idx = listeners.indexOf(cb);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (listeners.length === 0 && sensor) {
      destroy();
    }
  };

  return {
    element: element,
    bind: bind,
    destroy: destroy,
    unbind: unbind
  };
}; /**
    * Created by hustcc on 18/7/5.
    * Contract: i@hust.cc
    */