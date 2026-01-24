/**
 * Utility function to inject CSS styles into the page
 */
export async function injectStyle(page, styleText) {
  const CSS = styleText || `
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
`;
  
  await page.evaluate((css) => {
    const style = document.createElement('style');
    style.type = 'text/css';
    
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
  }, CSS);
}
