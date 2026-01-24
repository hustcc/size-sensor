import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the built UMD bundle
const sizeSensorBundle = readFileSync(path.join(__dirname, '../dist/size-sensor.min.js'), 'utf8');

test.describe('unbind', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent('<html><body><div id="wrapper"></div></body></html>');
    await page.addScriptTag({ content: sizeSensorBundle });
  });

  test('clear', async ({ page }) => {
    await page.evaluate(() => {
      const { bind, clear } = window.sizeSensor;
      const wrapper = document.getElementById('wrapper');
      
      bind(wrapper, () => {});
    });

    // Verify sensor-id is set
    let sensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });
    expect(sensorId).not.toBeNull();

    // Clear the sensor
    await page.evaluate(() => {
      const { clear } = window.sizeSensor;
      const wrapper = document.getElementById('wrapper');
      clear(wrapper);
    });

    // Verify sensor-id is removed
    sensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });
    expect(sensorId).toBeNull();
  });

  test('unbind', async ({ page }) => {
    await page.evaluate(() => {
      const { bind } = window.sizeSensor;
      const wrapper = document.getElementById('wrapper');
      
      window.unbindFunc = bind(wrapper, () => {});
    });

    // Verify sensor-id is set
    let sensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });
    expect(sensorId).not.toBeNull();

    // Call unbind
    await page.evaluate(() => {
      window.unbindFunc();
    });

    // Verify sensor-id is removed
    sensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });
    expect(sensorId).toBeNull();
  });
});
