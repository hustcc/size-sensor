import { clear, bind } from '../src';

describe('unbind', () => {
  // 创建 div
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.innerHTML = `<div id="wrapper"></div>`;

  const wrapper = document.getElementById('wrapper');

  test('clear', () => {
    bind(wrapper, () => {});
    expect(wrapper.getAttribute('size-sensor-id')).not.toBeNull();

    clear(wrapper);
    expect(wrapper.getAttribute('size-sensor-id')).toBeNull();
  });

  test('unbind', () => {
    const unbind = bind(wrapper, () => {});
    expect(wrapper.getAttribute('size-sensor-id')).not.toBeNull();

    unbind();
    expect(wrapper.getAttribute('size-sensor-id')).toBeNull();
  });
});
