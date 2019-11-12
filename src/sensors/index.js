/**
 * Created by hustcc on 18/7/5.
 * Contract: i@hust.cc
 */

import { createSensor as createObjectSensor } from './object';
import { createSensor as createResizeObserverSensor } from './resizeObserver';

/**
 * sensor strategies
 */
// export const createSensor = createObjectSensor;
export const createSensor = typeof ResizeObserver !== 'undefined' ? createResizeObserverSensor : createObjectSensor;
