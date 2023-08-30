import { clear, bind } from '../src';
import { Sensors } from '../src/sensorPool';

describe('#17', () => {
  // 创建 div
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.innerHTML = `<div id="wrapper"></div>`;

  const wrapper = document.getElementById('wrapper');

  test('memory leak', () => {
    const unbind1 = bind(wrapper, () => {});
    const unbind2 = bind(wrapper, () => {});

    const id = wrapper.getAttribute('size-sensor-id');

    expect(Object.keys(Sensors).length).toBe(1);
    expect(Sensors[id]).not.toBeUndefined();

    unbind1();
    expect(Object.keys(Sensors).length).toBe(1);
    expect(Sensors[id]).not.toBeNull();

    unbind2();
    expect(Object.keys(Sensors).length).toBe(0);
    expect(Sensors[id]).toBeUndefined();
  });
});
