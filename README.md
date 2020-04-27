# Sving

made SVG super easy.

Examples of introduction [the website](http://dntzhang.github.io/Sving/)

Examples of Application [the website](http://dntzhang.github.io/Sving/china.html) 


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

# Many thanks to
* [observe.js](https://github.com/kmdjs/observejs)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
