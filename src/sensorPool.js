/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import id from './id';
import { createSensor } from './sensors';
import { SizeSensorId } from './constant';

/**
 * all the sensor objects.
 * sensor pool
 */
const Sensors = {};

/**
 * get one sensor
 * @param element
 * @returns {*}
 */
export const getSensor = element => {
  const sensorId = element.getAttribute(SizeSensorId);

  // 1. if the sensor exists, then use it
  if (sensorId && Sensors[sensorId]) {
    return Sensors[sensorId];
  }

  // 2. not exist, then create one
  const newId = id();
  element.setAttribute(SizeSensorId, newId);

  const sensor = createSensor(element);
  // add sensor into pool
  Sensors[newId] = sensor;

  return sensor;
};

/**
 * 移除 sensor
 * @param sensor
 */
export const removeSensor = sensor => {
  const sensorId = sensor.element.getAttribute(SizeSensorId);

  // remove attribute
  sensor.element.removeAttribute(SizeSensorId);
  // remove event, dom of the sensor used
  sensor.destroy();

  // exist, then remove from pool
  if (sensorId && Sensors[sensorId]) {
    delete Sensors[sensorId];
  }
};
