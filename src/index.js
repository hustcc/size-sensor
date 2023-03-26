/**
 * Created by hustcc on 18/6/9.[高考时间]
 * Contract: i@hust.cc
 */

import { Sensors } from './constant';
import { getSensor } from './sensorPool';

/**
 * bind an element with resize callback function
 * @param {*} element
 * @param {*} cb
 */
export const bind = (element, cb) => {
  const sensor = getSensor(element);

  // listen with callback
  sensor.bind(cb);

  // return unbind function
  return () => {
    sensor.unbind(cb);
  };
};

/**
 * clear all the listener and sensor of an element
 * @param element
 */
export const clear = element => {
  const sensor = Sensors.get(element);
  if (sensor) {
    sensor.destroy();
  }
};

export const ver = '__VERSION__';
