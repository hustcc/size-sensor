import { clear, bind, ver } from '../src';
import pkg from '../package.json';
import { injectStyle } from './utils';


describe('size-sensor', () => {
  test('export', () => {
    expect(clear).toBeInstanceOf(Function);
    expect(bind).toBeInstanceOf(Function);

    expect(ver).toBe(pkg.version);
  });

  test('demo', () => {
    // 创建 div
    const div = document.createElement('div');
    document.body.appendChild(div);
    // 设置样式
    injectStyle();

    // div 结构
    div.innerHTML = `
      <div id="wrapper">
        <div id="size-indicator"></div>
      </div>
    `;

    // 开始 bind
    const indicator = document.getElementById('size-indicator');

    const cb = ele => {
      const size = getComputedStyle(ele);

      indicator.innerHTML = size.width + ' x ' + size.height;
      indicator.style.color = 'red';

      setTimeout(() => {
        indicator.style.color = 'black';
      }, 500);
    };

    // bind an ele, when size changed, do cb function
    bind(document.getElementById('wrapper'), cb);
  });
});
