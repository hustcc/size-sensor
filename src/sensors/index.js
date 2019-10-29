/**
 * Created by hustcc on 18/7/5.
 * Contract: i@hust.cc
 */

import { createSensor as createObjectSensor } from './object';
import { createSensor as createResizeObserverSensor } from './resizeObserver';

/**
 * sensor strategies
 */
const createSensorFunc = () => {
  return typeof ResizeObserver !== 'undefined' ? createResizeObserverSensor : createObjectSensor;
};

export const createSensor = createSensorFunc();
