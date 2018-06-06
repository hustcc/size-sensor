# size-sensor

> DOM element size sensor which will callback when the element size changed.
>
> DOM 元素尺寸监听器，当元素尺寸变化的时候，将会触发回调函数！


[![npm](https://img.shields.io/npm/v/size-sensor.svg)](https://www.npmjs.com/package/size-sensor)
[![npm](https://img.shields.io/npm/dm/size-sensor.svg)](https://www.npmjs.com/package/size-sensor)
[![gzip](http://img.badgesize.io/https://unpkg.com/size-sensor/dist/size-sensor.min.js?compression=gzip)](https://unpkg.com/size-sensor/dist/size-sensor.min.js)



## Install


> npm i --save size-sensor

Then import it.

```js
import { bind, clear } from 'size-sensor';
```

or import it by `script` in HTML, then get `sizeSensor` on window.

```html
<script src="https://unpkg.com/size-sensor/dist/size-sensor.min.js"></script>
```



## Usage


 - **bind & unbind**

```js
import { bind, clear } from 'size-sensor';

// bind the event on element, will get the `unbind` function
const unbind1 = bind(document.querySelector('.container'), size => {
  // do what you want to to.
});

const unbind2 = bind(document.querySelector('.container'), size => {
  // do what you want to to.
});

// if you want to cancel bind event.
unbind1();
```


 - **clear**

```js
import { bind, clear } from 'size-sensor';

/*
 * // bind the resize event.
 * const unbind1 = bind(...);
 * const unbind2 = bind(...);
 * ...
 */

// you can cancel all the event of element.
clear(element);
```



## API


There is only 2 API:


 - **bind(element, callback)**

Bind the resize trigger function on element. The function will return `unbind` function.

 - **clear(element)**

Clear all the object and resize event on element.



## Reference

Online demo click [here](http://git.hust.cc/size-sensor). Rewrite from [KyleAMathews/element-resize-event](https://github.com/KyleAMathews/element-resize-event), will be used on [hustcc/echarts-for-react](https://github.com/hustcc/echarts-for-react).



# License


ISC@[hustcc](https://github.com/hustcc).
