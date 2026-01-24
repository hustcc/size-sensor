const { test, expect } = require('@playwright/test');
const { injectStyle } = require('./utils');
const path = require('path');
const fs = require('fs');

// Read package.json to get version
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

test.describe('size-sensor', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test fixture
    await page.goto(`file://${path.join(__dirname, 'fixtures/index.html')}`);
  });

  test('export', async ({ page }) => {
    // Check that the library exports are functions
    const exports = await page.evaluate(() => {
      return {
        clearIsFunction: typeof window.sizeSensor.clear === 'function',
        bindIsFunction: typeof window.sizeSensor.bind === 'function',
        ver: window.sizeSensor.ver,
      };
    });

    expect(exports.clearIsFunction).toBe(true);
    expect(exports.bindIsFunction).toBe(true);
    expect(exports.ver).toBe(packageJson.version);
  });

  test('demo', async ({ page }) => {
    // Inject styles
    await injectStyle(page);

    // Create DOM structure and set up size sensor
    await page.evaluate(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      div.innerHTML = `
        <div id="wrapper">
          <div id="size-indicator"></div>
        </div>
      `;

      const indicator = document.getElementById('size-indicator');
      const wrapper = document.getElementById('wrapper');

      const cb = (ele) => {
        const size = getComputedStyle(ele);
        indicator.innerHTML = size.width + ' x ' + size.height;
        indicator.style.color = 'red';

        setTimeout(() => {
          indicator.style.color = 'black';
        }, 500);
      };

      // bind an ele, when size changed, do cb function
      window.sizeSensor.bind(wrapper, cb);
    });

    // Wait a bit for the sensor to initialize
    await page.waitForTimeout(100);

    // Check that the wrapper has the size-sensor-id attribute
    const hasSensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id') !== null;
    });

    expect(hasSensorId).toBe(true);
  });
});
