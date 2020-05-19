/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import debounce from '../debounce';
import { SensorClassName, SensorTabIndex } from '../constant';

export const createSensor = element => {
  let sensor = undefined;
  // callback
  let listeners = [];

  /**
   * create object DOM of sensor
   * @returns {HTMLObjectElement}
   */
  const newSensor = () => {
    // adjust style
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }

    const obj = document.createElement('object');
    obj.onload = () => {
      obj.contentDocument.defaultView.addEventListener('resize', resizeListener);
      // 直接触发一次 resize
      resizeListener();
    };
    obj.style.display = 'block'
    obj.style.position = 'absolute'
    obj.style.top = '0'
    obj.style.left = '0'
    obj.style.height = '100%'
    obj.style.width = '100%'
    obj.style.overflow = 'hidden'
    obj.style.pointerEvents = 'none'
    obj.style.zIndex = '-1'
    obj.style.opacity = '0'
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
  const resizeListener = debounce(() => {
    // trigger all listener
    listeners.forEach(listener => {
      listener(element);
    })
  });

  /**
   * listen with one callback function
   * @param cb
   */
  const bind = cb => {
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
  const destroy = () => {
    if (sensor && sensor.parentNode) {
      if (sensor.contentDocument) {
        // remote event
        sensor.contentDocument.defaultView.removeEventListener('resize', resizeListener);
      }
      // remove dom
      sensor.parentNode.removeChild(sensor);
      // initial variable
      sensor = undefined;
      listeners = [];
    }
  };

  /**
   * cancel listener bind
   * @param cb
   */
  const unbind = cb => {
    const idx = listeners.indexOf(cb);
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
    element,
    bind,
    destroy,
    unbind,
  };
};
