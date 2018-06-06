/**
 * Created by hustcc on 18/6/9.[高考时间]
 * Contract: i@hust.cc
 */

import { getSensor, removeSensor } from './sensorPool';

/**
 * 对外暴露的 bind 方法
 * @param {*} element
 * @param {*} cb
 */
export const bind = (element, cb) => {
  const sensor = getSensor(element);

  // 绑定新的方法
  sensor.bind(cb);

  // 返回 unbind 方法
  return () => {
    sensor.unbind(cb);
  };
};

/**
 * 清空一个 element 中的所有监听
 * @param element
 */
export const clear = element => {
  const sensor = getSensor(element);

  removeSensor(sensor);
};
