const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('unbind', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test fixture
    await page.goto(`file://${path.join(__dirname, 'fixtures/index.html')}`);
    
    // Create DOM structure
    await page.evaluate(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.innerHTML = `<div id="wrapper"></div>`;
    });
  });

  test('clear', async ({ page }) => {
    const result = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      
      // Bind a sensor
      window.sizeSensor.bind(wrapper, () => {});
      const hasIdBefore = wrapper.getAttribute('size-sensor-id') !== null;
      
      // Clear the sensor
      window.sizeSensor.clear(wrapper);
      const hasIdAfter = wrapper.getAttribute('size-sensor-id') !== null;
      
      return { hasIdBefore, hasIdAfter };
    });

    expect(result.hasIdBefore).toBe(true);
    expect(result.hasIdAfter).toBe(false);
  });

  test('unbind', async ({ page }) => {
    const result = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      
      // Bind a sensor
      const unbind = window.sizeSensor.bind(wrapper, () => {});
      const hasIdBefore = wrapper.getAttribute('size-sensor-id') !== null;
      
      // Unbind the sensor
      unbind();
      const hasIdAfter = wrapper.getAttribute('size-sensor-id') !== null;
      
      return { hasIdBefore, hasIdAfter };
    });

    expect(result.hasIdBefore).toBe(true);
    expect(result.hasIdAfter).toBe(false);
  });
});
