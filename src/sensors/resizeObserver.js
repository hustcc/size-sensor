/**
 * Created by hustcc on 18/7/5.
 * Contract: i@hust.cc
 */

import { SizeSensorId } from '../constant';
import debounce from '../debounce';

export const createSensor = (element, whenDestroy) => {
  let sensor = undefined;
  // callback
  let listeners = [];

  /**
   * trigger listeners
   */
  const resizeListener = debounce(() => {
    // trigger all
    listeners.forEach(listener => {
      listener(element);
    })
  });

  /**
   * create ResizeObserver sensor
   * @returns
   */
  const newSensor = () => {
    const s = new ResizeObserver(resizeListener);
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
  const bind = cb => {
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
  const destroy = () => {
    sensor.disconnect();

    listeners = [];
    sensor = undefined;
    element.removeAttribute(SizeSensorId);
    whenDestroy && whenDestroy();
  };

  /**
   * cancel bind
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
