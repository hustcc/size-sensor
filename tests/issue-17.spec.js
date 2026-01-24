const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('#17 memory leak', () => {
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

  test('memory leak', async ({ page }) => {
    const result = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper');
      
      // Bind two sensors to the same element
      const unbind1 = window.sizeSensor.bind(wrapper, () => {});
      const unbind2 = window.sizeSensor.bind(wrapper, () => {});
      
      const id = wrapper.getAttribute('size-sensor-id');
      
      // Access the internal Sensors pool - we need to expose it for testing
      // The Sensors pool is not exposed in the UMD build by default
      // We'll need to verify the behavior through the attributes and unbind functions
      
      // After binding, the element should have a sensor ID
      const hasIdInitial = id !== null;
      
      // Unbind the first sensor
      unbind1();
      const hasIdAfterFirst = wrapper.getAttribute('size-sensor-id') !== null;
      
      // Unbind the second sensor
      unbind2();
      const hasIdAfterSecond = wrapper.getAttribute('size-sensor-id') !== null;
      
      return {
        hasIdInitial,
        hasIdAfterFirst,
        hasIdAfterSecond,
        id
      };
    });

    // The element should have a sensor ID initially
    expect(result.hasIdInitial).toBe(true);
    expect(result.id).not.toBeNull();
    
    // After first unbind, the sensor should still exist (second callback still bound)
    expect(result.hasIdAfterFirst).toBe(true);
    
    // After second unbind, the sensor should be completely removed
    expect(result.hasIdAfterSecond).toBe(false);
  });
});
