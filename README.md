# Sving

Made SVG Easy.

* [Hello Sving](http://dntzhang.github.io/sving/examples/simple.html)
* [Animation](http://dntzhang.github.io/sving/)
* [Map](http://dntzhang.github.io/sving/examples/map.html)


# Install

the file is  here: [sving.js](https://raw.githubusercontent.com/dntzhang/Sving/master/dist/sving.js) or [sving.min.js](https://raw.githubusercontent.com/dntzhang/Sving/master/dist/sving.min.js)

You can also install it via npm:

```html
npm install sving
```

Sving can be used in the CommonJS/AMD module definition environment, but also directly through the script tag reference in your page ,such as:

```html
<script src="sving.js"></script>
```

you can get the Sving module by synchronizing require in the AMD module definition environment:

```javascript
define(function (require) {
    var Sving = require('sving');
});
```

or asynchronous require：

```javascript
require([ 'sving' ], function (Sving) {
});
```

or  require in the CommonJS module definition environment:

```javascript
var Sving = require('sving');
```

# Attr Options

```json
{
  "arrow-end": "none",
  "arrow-start": "none",
  blur: 0,
  "clip-rect": "0 0 1e9 1e9",
  cursor: "default",
  cx: 0,
  cy: 0,
  fill: "#fff",
  "fill-opacity": 1,
  font: '10px "Arial"',
  "font-family": '"Arial"',
  "font-size": "10",
  "font-style": "normal",
  "font-weight": 400,
  gradient: 0,
  height: 0,
  href: "http://alloyteam.com/",
  "letter-spacing": 0,
  opacity: 1,
  path: "M0,0",
  r: 0,
  rx: 0,
  ry: 0,
  src: "",
  stroke: "#000",
  "stroke-dasharray": "",
  "stroke-linecap": "butt",
  "stroke-linejoin": "butt",
  "stroke-miterlimit": 0,
  "stroke-opacity": 1,
  "stroke-width": 1,
  target: "_blank",
  "text-anchor": "middle",
  title: "sving",
  transform: "",
  width: 0,
  x: 0,
  y: 0
}
```

# License

 [MIT](http://opensource.org/licenses/MIT) License.
