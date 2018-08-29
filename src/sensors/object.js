/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import debounce from '../debounce';
import { SensorStyle, SensorClassName } from '../constant';

export const createSensor = element => {
  // 感应器
  let sensor = undefined;
  // callback
  let listeners = [];

  /**
   * 创建 sensor 的 object DOM
   * @returns {HTMLObjectElement}
   */
  const newSensor = () => {
    // 调整样式
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }

    const obj = document.createElement('object');
    obj.onload = () => {
      obj.contentDocument.defaultView.addEventListener('resize', resizeListener);
      // 直接触发一次 resize
      resizeListener();
    };
    obj.setAttribute('style', SensorStyle);
    obj.setAttribute('class', SensorClassName);
    obj.type = 'text/html';

    // 添加到 dom 结构中
    element.appendChild(obj);
    // 对于 ie 需要滞后，否则白屏，所以放到后面
    obj.data = 'about:blank';
    return obj;
  };

  /**
   * 统一触发 listeners
   */
  const resizeListener = debounce(() => {
    // 依次触发执行
    listeners.forEach(listener => {
      listener(element);
    })
  });

  /**
   * 监听某一个 callback
   * @param cb
   */
  const bind = cb => {
    // 如果不存在 sensor，则创建一个 object
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
  const destroy = () => {
    if (sensor && sensor.parentNode) {
      if (sensor.contentDocument) {
        // 移除事件
        sensor.contentDocument.defaultView.removeEventListener('resize', resizeListener);
      }
      // 移除 dom
      sensor.parentNode.removeChild(sensor);
      // 初始化
      sensor = undefined;
      listeners = [];
    }
  };

  /**
   * 取消绑定
   * @param cb
   */
  const unbind = cb => {
    const idx = listeners.indexOf(cb);
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
    element,
    bind,
    destroy,
    unbind,
  };
};
