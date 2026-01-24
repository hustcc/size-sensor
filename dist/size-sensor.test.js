(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.sizeSensor = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Created by hustcc on 18/6/9.
   * Contract: i@hust.cc
   */

  var id = 1;

  /**
   * generate unique id in application
   * @return {string}
   */
  var id$1 = (function () {
    return "".concat(id++);
  });

  /**
   * Created by hustcc on 18/6/9.
   * Contract: i@hust.cc
   */

  var debounce = (function (fn) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
    var timer = null;
    return function () {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(_this, args);
      }, delay);
    };
  });

  /**
   * Created by hustcc on 18/6/9.
   * Contract: i@hust.cc
   */

  var SizeSensorId = 'size-sensor-id';
  var SensorClassName = 'size-sensor-object';
  var SensorTabIndex = '-1';

  /**
   * Created by hustcc on 18/6/9.
   * Contract: i@hust.cc
   */
  var createSensor = function createSensor(element, whenDestroy) {
    var sensor = undefined;
    // callback
    var listeners = [];

    /**
     * create object DOM of sensor
     * @returns {HTMLObjectElement}
     */
    var newSensor = function newSensor() {
      // adjust style
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      var obj = document.createElement('object');
      obj.onload = function () {
        obj.contentDocument.defaultView.addEventListener('resize', resizeListener);
        // 直接触发一次 resize
        resizeListener();
      };
      obj.style.display = 'block';
      obj.style.position = 'absolute';
      obj.style.top = '0';
      obj.style.left = '0';
      obj.style.height = '100%';
      obj.style.width = '100%';
      obj.style.overflow = 'hidden';
      obj.style.pointerEvents = 'none';
      obj.style.zIndex = '-1';
      obj.style.opacity = '0';
      obj.setAttribute('class', SensorClassName);
      obj.setAttribute('tabindex', SensorTabIndex);
      obj.type = 'text/html';

      // append into dom
      element.appendChild(obj);
      // for ie, should set data attribute delay, or will be white screen
      obj.data = 'about:blank';
      return obj;
    };

    /**
     * trigger listeners
     */
    var resizeListener = debounce(function () {
      // trigger all listener
      listeners.forEach(function (listener) {
        listener(element);
      });
    });

    /**
     * listen with one callback function
     * @param cb
     */
    var bind = function bind(cb) {
      // if not exist sensor, then create one
      if (!sensor) {
        sensor = newSensor();
      }
      if (listeners.indexOf(cb) === -1) {
        listeners.push(cb);
      }
    };

    /**
     * destroy all
     */
    var destroy = function destroy() {
      if (sensor && sensor.parentNode) {
        if (sensor.contentDocument) {
          // remote event
          sensor.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        }
        // remove dom
        sensor.parentNode.removeChild(sensor);
        // initial variable
        element.removeAttribute(SizeSensorId);
        sensor = undefined;
        listeners = [];
        whenDestroy && whenDestroy();
      }
    };

    /**
     * cancel listener bind
     * @param cb
     */
    var unbind = function unbind(cb) {
      var idx = listeners.indexOf(cb);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }

      // no listener, and sensor is exist
      // then destroy the sensor
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
  };

  /**
   * Created by hustcc on 18/7/5.
   * Contract: i@hust.cc
   */
  var createSensor$1 = function createSensor(element, whenDestroy) {
    var sensor = undefined;
    // callback
    var listeners = [];

    /**
     * trigger listeners
     */
    var resizeListener = debounce(function () {
      // trigger all
      listeners.forEach(function (listener) {
        listener(element);
      });
    });

    /**
     * create ResizeObserver sensor
     * @returns
     */
    var newSensor = function newSensor() {
      var s = new ResizeObserver(resizeListener);
      // listen element
      s.observe(element);

      // trigger once
      resizeListener();
      return s;
    };

    /**
     * listen with callback
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
     * destroy
     */
    var destroy = function destroy() {
      if (sensor) {
        sensor.disconnect();
      }
      listeners = [];
      sensor = undefined;
      element.removeAttribute(SizeSensorId);
      whenDestroy && whenDestroy();
    };

    /**
     * cancel bind
     * @param cb
     */
    var unbind = function unbind(cb) {
      var idx = listeners.indexOf(cb);
      if (idx !== -1) {
        listeners.splice(idx, 1);
      }

      // no listener, and sensor is exist
      // then destroy the sensor
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
  };

  /**
   * Created by hustcc on 18/7/5.
   * Contract: i@hust.cc
   */

  /**
   * sensor strategies
   */
  // export const createSensor = createObjectSensor;
  var createSensor$2 = typeof ResizeObserver !== 'undefined' ? createSensor$1 : createSensor;

  /**
   * Created by hustcc on 18/6/9.
   * Contract: i@hust.cc
   */

  /**
   * all the sensor objects.
   * sensor pool
   */
  var Sensors = {};

  /**
   * When destroy the sensor, remove it from the pool
   */
  function clean(sensorId) {
    // exist, then remove from pool
    if (sensorId && Sensors[sensorId]) {
      delete Sensors[sensorId];
    }
  }

  /**
   * get one sensor
   * @param element
   * @returns {*}
   */
  var getSensor = function getSensor(element) {
    var sensorId = element.getAttribute(SizeSensorId);

    // 1. if the sensor exists, then use it
    if (sensorId && Sensors[sensorId]) {
      return Sensors[sensorId];
    }

    // 2. not exist, then create one
    var newId = id$1();
    element.setAttribute(SizeSensorId, newId);
    var sensor = createSensor$2(element, function () {
      return clean(newId);
    });
    // add sensor into pool
    Sensors[newId] = sensor;
    return sensor;
  };

  /**
   * 移除 sensor
   * @param sensor
   */
  var removeSensor = function removeSensor(sensor) {
    var sensorId = sensor.element.getAttribute(SizeSensorId);
    // remove event, dom of the sensor used
    sensor.destroy();
    clean(sensorId);
  };

  /**
   * Created by hustcc on 18/6/9.[高考时间]
   * Contract: i@hust.cc
   */

  /**
   * bind an element with resize callback function
   * @param {*} element
   * @param {*} cb
   */
  var bind = function bind(element, cb) {
    var sensor = getSensor(element);

    // listen with callback
    sensor.bind(cb);

    // return unbind function
    return function () {
      sensor.unbind(cb);
    };
  };

  /**
   * clear all the listener and sensor of an element
   * @param element
   */
  var clear = function clear(element) {
    var sensor = getSensor(element);
    removeSensor(sensor);
  };
  var ver = "1.0.3";

  exports.bind = bind;
  exports.clear = clear;
  exports.ver = ver;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=size-sensor.test.js.map
