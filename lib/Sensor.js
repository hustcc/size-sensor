'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sensor = undefined;

var _debounce = require('./debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by hustcc on 18/6/9.
                                                                                                                                                           * Contract: i@hust.cc
                                                                                                                                                           */

var Sensor = exports.Sensor = function Sensor(element) {
  var _this = this;

  _classCallCheck(this, Sensor);

  this.createSensor = function () {
    var obj = document.createElement('object');
    obj.setAttribute('style', _constant.SensorStyle);
    obj.setAttribute('class', _constant.SensorClassName);
    obj.type = 'text/html';
    obj.data = 'about:blank';

    // 调整样式
    if (getComputedStyle(_this.element).position === 'static') {
      _this.element.style.position = 'relative';
    }

    obj.onload = function () {
      obj.contentDocument.defaultView.addEventListener('resize', _this.resizeListener);
      // 直接触发一次 resize
      _this.resizeListener();
    };

    // 添加到 dom 结构中
    _this.element.appendChild(obj);

    return obj;
  };

  this.resizeListener = (0, _debounce2.default)(function () {
    var _getComputedStyle = getComputedStyle(_this.element),
        width = _getComputedStyle.width,
        height = _getComputedStyle.height;

    // 依次触发执行


    _this.listeners.forEach(function (listener) {
      listener({
        width: width,
        height: height
      });
    });
  });

  this.bind = function (cb) {
    // 如果不存在 sensor，则创建一个 object
    if (!_this.sensor) {
      _this.sensor = _this.createSensor();
    }

    if (_this.listeners.indexOf(cb) === -1) {
      _this.listeners.push(cb);
    }
  };

  this.unbind = function (cb) {
    var idx = _this.listeners.indexOf(cb);
    if (idx !== -1) {
      _this.listeners.splice(idx, 1);
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (_this.listeners.length === 0 && _this.sensor) {
      _this.destroy();
    }
  };

  this.destroy = function () {
    if (_this.sensor && _this.sensor.parentNode) {
      // 移除事件
      _this.sensor.contentDocument.defaultView.removeEventListener('resize', _this.resizeListener);
      // 移除 dom
      _this.sensor.parentNode.removeChild(_this.sensor);
      // 初始化
      _this.sensor = undefined;
      _this.listeners = [];
    }
  };

  this.element = element;

  this.listeners = [];

  // 感应器
  this.sensor = undefined;
}

/**
 * 创建 sensor 的 object DOM
 * @returns {HTMLObjectElement}
 */


/**
 * 统一触发 listeners
 */


/**
 * 监听某一个 callback
 * @param cb
 */


/**
 * 取消绑定
 * @param cb
 */


/**
 * 完全 destroy
 */
;