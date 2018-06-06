/**
 * Created by hustcc on 18/6/9.
 * Contract: i@hust.cc
 */

export default (fn, delay = 30) => {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
