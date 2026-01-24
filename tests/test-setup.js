const { test: baseTest, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const v8toIstanbul = require('v8-to-istanbul');

// Extend the base test to add coverage collection
const test = baseTest.extend({
  page: async ({ page }, use) => {
    // Only start coverage for Chromium (coverage API is only available in Chromium)
    const isChromium = page.context().browser()?.browserType().name() === 'chromium';
    
    if (isChromium) {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }
    
    await use(page);
    
    if (isChromium) {
      const coverage = await page.coverage.stopJSCoverage();
      await saveCoverage(coverage);
    }
  },
});

async function saveCoverage(coverageData) {
  const coverageDir = path.join(__dirname, '../coverage');
  const tempDir = path.join(coverageDir, 'tmp');
  
  // Create coverage directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  for (const entry of coverageData) {
    // Only process our test file
    if (entry.url.includes('size-sensor.test.js') && !entry.url.includes('.map')) {
      const testFilePath = path.join(__dirname, '../dist/size-sensor.test.js');
      const sourceMapPath = testFilePath + '.map';
      
      // Read the source map
      let sourceMap;
      try {
        sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf-8'));
      } catch (e) {
        console.warn('Could not read source map:', e.message);
        continue;
      }
      
      // Convert V8 coverage to Istanbul format with source map
      const converter = v8toIstanbul(testFilePath, 0, { 
        source: entry.source,
        sourceMap: {
          sourcemap: sourceMap
        }
      });
      
      await converter.load();
      converter.applyCoverage(entry.functions);
      
      const istanbulCoverage = converter.toIstanbul();
      
      // Save coverage data
      const timestamp = Date.now();
      const outputFile = path.join(tempDir, `coverage-${timestamp}-${Math.random().toString(36).substr(2, 9)}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(istanbulCoverage, null, 2));
    }
  }
}

module.exports = { test, expect };
