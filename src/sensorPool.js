/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

import id from './id';
import { createSensor } from './sensor';
import { SizeSensorId } from './constant';

/**
 * all the sensor objects.
 * 传感器池子
 */
const Sensors = {};

/**
 * 获取 sensor
 * @param element
 * @returns {*}
 */
export const getSensor = element => {
  const sensorId = element.getAttribute(SizeSensorId);

  // 1. 已经存在，则直接取这个 sensor
  if (sensorId && Sensors[sensorId]) {
    return Sensors[sensorId];
  }

  // 2. 不存在则创建
  const newId = id();
  element.setAttribute(SizeSensorId, newId);

  const sensor = createSensor(element);
  // 添加到池子中
  Sensors[newId] = sensor;

  return sensor;
};

/**
 * 移除 sensor
 * @param sensor
 */
export const removeSensor = sensor => {
  const sensorId = sensor.element.getAttribute(SizeSensorId);

  // 移除 attribute
  sensor.element.removeAttribute(SizeSensorId);
  // 移除 sensor 对应的 事件 和 dom 结构
  sensor.destroy();

  // 存在则从 pool 中移除
  if (sensorId && Sensors[sensorId]) {
    delete Sensors[sensorId];
  }
};
