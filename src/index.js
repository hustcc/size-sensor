/**
 * Created by hustcc on 18/6/9.[高考时间]
 * Contract: i@hust.cc
 */

import { getSensor, removeSensor } from './sensorPool';

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
  const sensor = getSensor(element);

  removeSensor(sensor);
};

export const ver = '__VERSION__';
