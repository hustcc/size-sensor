import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the built UMD bundle
const sizeSensorBundle = readFileSync(path.join(__dirname, '../dist/size-sensor.min.js'), 'utf8');

test.describe('#17', () => {
  test('memory leak', async ({ page }) => {
    await page.setContent('<html><body><div id="wrapper"></div></body></html>');
    await page.addScriptTag({ content: sizeSensorBundle });

    // Create two bindings on the same element
    await page.evaluate(() => {
      const { bind } = window.sizeSensor;
      const wrapper = document.getElementById('wrapper');
      
      window.unbind1 = bind(wrapper, () => {});
      window.unbind2 = bind(wrapper, () => {});
    });

    // Get the sensor ID
    const sensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });

    // Verify that a sensor was created
    expect(sensorId).not.toBeNull();
    
    // Verify that only one sensor object element exists (for ResizeObserver fallback)
    let sensorObjectCount = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.querySelectorAll('.size-sensor-object').length;
    });
    
    // Should be 0 or 1 (depends on if ResizeObserver is available)
    expect(sensorObjectCount).toBeLessThanOrEqual(1);

    // Call first unbind
    await page.evaluate(() => {
      window.unbind1();
    });

    // Verify sensor is still attached (because unbind2 still references it)
    let stillHasSensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id') !== null;
    });
    expect(stillHasSensorId).toBe(true);

    // Call second unbind
    await page.evaluate(() => {
      window.unbind2();
    });

    // Verify sensor is now removed
    const finalSensorId = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.getAttribute('size-sensor-id');
    });
    expect(finalSensorId).toBeNull();

    // Verify sensor object is also removed
    sensorObjectCount = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      return wrapper.querySelectorAll('.size-sensor-object').length;
    });
    expect(sensorObjectCount).toBe(0);
  });
});
