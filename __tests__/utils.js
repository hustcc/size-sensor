const CSS = `
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

export const injectStyle = (styleText = CSS) => {
  const style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = styleText;
  } else {
    style.appendChild(document.createTextNode(styleText));
  }
  document.head.appendChild(style);
};
