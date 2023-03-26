/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */
import id from './id';
import { createSensor } from './sensors';
import { Sensors, SizeSensorId } from './constant';

/**
 * get one sensor
 * @param element
 * @returns {*}
 */
export const getSensor = element => {
  let sensor = Sensors.get(element);
  if (!sensor) {
    sensor = createSensor(element);
    Sensors.set(element, sensor);
    const newId = id();
    element.setAttribute(SizeSensorId, newId);
  }
  return sensor;
};
