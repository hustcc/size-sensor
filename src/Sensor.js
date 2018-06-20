/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import debounce from './debounce';
import { SensorStyle, SensorClassName } from './constant';


export class Sensor {
  constructor(element) {
    this.element = element;

    this.listeners = [];

    // 感应器
    this.sensor = undefined;
  }

  /**
   * 创建 sensor 的 object DOM
   * @returns {HTMLObjectElement}
   */
  createSensor = () => {
    const obj = document.createElement('object');
    obj.setAttribute('style', SensorStyle);
    obj.setAttribute('class', SensorClassName);
    obj.type = 'text/html';
    obj.data = 'about:blank';

    // 调整样式
    if (getComputedStyle(this.element).position === 'static') {
      this.element.style.position = 'relative'
    }

    obj.onload = () => {
      obj.contentDocument.defaultView.addEventListener('resize', this.resizeListener);
      // 直接触发一次 resize
      this.resizeListener();
    };

    // 添加到 dom 结构中
    this.element.appendChild(obj);

    return obj;
  };

  /**
   * 统一触发 listeners
   */
  resizeListener = debounce(() => {
    // 依次触发执行
    this.listeners.forEach(listener => {
      listener(this.element);
    })
  });

  /**
   * 监听某一个 callback
   * @param cb
   */
  bind = cb => {
    // 如果不存在 sensor，则创建一个 object
    if (!this.sensor) {
      this.sensor = this.createSensor();
    }

    if (this.listeners.indexOf(cb) === -1) {
      this.listeners.push(cb);
    }
  };

  /**
   * 取消绑定
   * @param cb
   */
  unbind = cb => {
    const idx = this.listeners.indexOf(cb);
    if (idx !== -1) {
      this.listeners.splice(idx, 1);
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (this.listeners.length === 0 && this.sensor) {
      this.destroy();
    }
  };

  /**
   * 完全 destroy
   */
  destroy = () => {
    if (this.sensor && this.sensor.parentNode) {
      // 移除事件
      this.sensor.contentDocument.defaultView.removeEventListener('resize', this.resizeListener);
      // 移除 dom
      this.sensor.parentNode.removeChild(this.sensor);
      // 初始化
      this.sensor = undefined;
      this.listeners = [];
    }
  }
}
