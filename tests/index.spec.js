import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the built UMD bundle
const sizeSensorBundle = readFileSync(join(__dirname, '../dist/size-sensor.min.js'), 'utf8');

test.describe('size-sensor', () => {
  test('export', async ({ page }) => {
    // Load the size-sensor library
    await page.setContent('<html><body></body></html>');
    await page.addScriptTag({ content: sizeSensorBundle });

    // Test exports
    const hasExports = await page.evaluate(() => {
      const { bind, clear, ver } = window.sizeSensor;
      return {
        bindIsFunction: typeof bind === 'function',
        clearIsFunction: typeof clear === 'function',
        verExists: typeof ver === 'string' && ver.length > 0
      };
    });

    expect(hasExports.bindIsFunction).toBe(true);
    expect(hasExports.clearIsFunction).toBe(true);
    expect(hasExports.verExists).toBe(true);
  });

  test('demo', async ({ page }) => {
    // Create a page with the demo setup
    await page.setContent(`
      <html>
        <head>
          <style>
            #wrapper {
              position: relative; 
              height: 400px;
              background-color: #8bcdaf
            }

            #size-indicator {
              position: absolute;
              right: 4px;
              bottom: 4px;
              font-size: 10px;
              color: black;
            }
          </style>
        </head>
        <body>
          <div id="wrapper">
            <div id="size-indicator"></div>
          </div>
        </body>
      </html>
    `);

    // Load the size-sensor library
    await page.addScriptTag({ content: sizeSensorBundle });

    // Bind the sensor and verify it works
    await page.evaluate(() => {
      const { bind } = window.sizeSensor;
      const indicator = document.getElementById('size-indicator');
      const wrapper = document.getElementById('wrapper');

      const cb = ele => {
        const size = getComputedStyle(ele);
        indicator.innerHTML = size.width + ' x ' + size.height;
        indicator.style.color = 'red';

        setTimeout(() => {
          indicator.style.color = 'black';
        }, 500);
      };

      // bind an element, when size changed, do cb function
      bind(wrapper, cb);
    });

    // Verify the binding was successful
    const hasSensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id') !== null;
    });

    expect(hasSensorId).toBe(true);
  });
});
