/* Sword
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/Sword
 * MIT Licensed.
 */
; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === "function" && define.cmd) {
        define(function (require, exports, module) {
            module.exports = factory();
        });
    } else {
        root.Sword = factory();
    }
}(this, function () {


    function Matrix2D(a, b, c, d, tx, ty) {
        this.setValues(a, b, c, d, tx, ty);
    }
   
    Matrix2D.DEG_TO_RAD = Math.PI / 180;

    Matrix2D.identity = null; // set at bottom of class definition.
    Matrix2D.prototype = {
        setValues: function (a, b, c, d, tx, ty) {
            // don't forget to update docs in the constructor if these change:
            this.a = (a == null) ? 1 : a;
            this.b = b || 0;
            this.c = c || 0;
            this.d = (d == null) ? 1 : d;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        },

        append: function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a1 * a + c1 * b;
                this.b = b1 * a + d1 * b;
                this.c = a1 * c + c1 * d;
                this.d = b1 * c + d1 * d;
            }
            this.tx = a1 * tx + c1 * ty + this.tx;
            this.ty = b1 * tx + d1 * ty + this.ty;
            return this;
        },

        appendTransform: function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * Matrix2D.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                // TODO: can this be combined into a single append operation?
                skewX *= Matrix2D.DEG_TO_RAD;
                skewY *= Matrix2D.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            } else {
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }

            if (regX || regY) {
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        },

        identity: function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        },

        copy: function (matrix) {
            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        },

        clone: function () {
            return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
        },

        toString: function () {
            return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
        }
    }
  

    Matrix2D.identity = new Matrix2D();

/* observejs --- By dnt http://kmdjs.github.io/
 * Github: https://github.com/kmdjs/observejs
 * MIT Licensed.
 */

    var observe = function (target, arr, callback) {
        var _observe = function (target, arr, callback) {
            if (!target.$observer) target.$observer = this;
            var $observer = target.$observer;
            var eventPropArr = [];
            if (observe.isArray(target)) {
                if (target.length === 0) {
                    target.$observeProps = {};
                    target.$observeProps.$observerPath = "#";
                }
                $observer.mock(target);

            }
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    if (callback) {
                        if (observe.isArray(arr) && observe.isInArray(arr, prop)) {
                            eventPropArr.push(prop);
                            $observer.watch(target, prop);
                        } else if (observe.isString(arr) && prop == arr) {
                            eventPropArr.push(prop);
                            $observer.watch(target, prop);
                        }
                    } else {
                        eventPropArr.push(prop);
                        $observer.watch(target, prop);
                    }
                }
            }
            $observer.target = target;
            if (!$observer.propertyChangedHandler) $observer.propertyChangedHandler = [];
            var propChanged = callback ? callback : arr;
            $observer.propertyChangedHandler.push({ all: !callback, propChanged: propChanged, eventPropArr: eventPropArr });
        }
        _observe.prototype = {
            "onPropertyChanged": function (prop, value, oldValue, target, path) {
                if (value !== oldValue && this.propertyChangedHandler) {
                    var rootName = observe._getRootName(prop, path);
                    for (var i = 0, len = this.propertyChangedHandler.length; i < len; i++) {
                        var handler = this.propertyChangedHandler[i];
                        if (handler.all || observe.isInArray(handler.eventPropArr, rootName) || rootName.indexOf("Array-") === 0) {
                            handler.propChanged.call(this.target, prop, value, oldValue, path);
                        }
                    }
                }
                if (prop.indexOf("Array-") !== 0 && typeof value === "object") {
                    this.watch(target, prop, target.$observeProps.$observerPath);
                }
            },
            "mock": function (target) {
                var self = this;
                observe.methods.forEach(function (item) {
                    target[item] = function () {
                        var old = Array.prototype.slice.call(this, 0);
                        var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                        if (new RegExp("\\b" + item + "\\b").test(observe.triggerStr)) {
                            for (var cprop in this) {
                                if (this.hasOwnProperty(cprop) && !observe.isFunction(this[cprop])) {
                                    self.watch(this, cprop, this.$observeProps.$observerPath);
                                }
                            }
                            //todo
                            self.onPropertyChanged("Array-" + item, this, old, this, this.$observeProps.$observerPath);
                        }
                        return result;
                    };
                });
            },
            "watch": function (target, prop, path) {
                if (prop === "$observeProps" || prop === "$observer") return;
                if (observe.isFunction(target[prop])) return;
                if (!target.$observeProps) target.$observeProps = {};
                if (path !== undefined) {
                    target.$observeProps.$observerPath = path;
                } else {
                    target.$observeProps.$observerPath = "#";
                }
                var self = this;
                var currentValue = target.$observeProps[prop] = target[prop];
                Object.defineProperty(target, prop, {
                    get: function () {
                        return this.$observeProps[prop];
                    },
                    set: function (value) {
                        var old = this.$observeProps[prop];
                        this.$observeProps[prop] = value;
                        self.onPropertyChanged(prop, value, old, this, target.$observeProps.$observerPath);
                    }
                });
                if (typeof currentValue == "object") {
                    if (observe.isArray(currentValue)) {
                        this.mock(currentValue);
                        if (currentValue.length === 0) {
                            if (!currentValue.$observeProps) currentValue.$observeProps = {};
                            if (path !== undefined) {
                                currentValue.$observeProps.$observerPath = path;
                            } else {
                                currentValue.$observeProps.$observerPath = "#";
                            }
                        }
                    }
                    for (var cprop in currentValue) {
                        if (currentValue.hasOwnProperty(cprop)) {
                            this.watch(currentValue, cprop, target.$observeProps.$observerPath + "-" + prop);
                        }
                    }
                }
            }
        }
        return new _observe(target, arr, callback)
    }
    observe.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "toLocaleString", "toString", "size"]
    observe.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift", "size"].join(",")
    observe.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    observe.isString = function (obj) {
        return typeof obj === "string";
    }
    observe.isInArray = function (arr, item) {
        for (var i = arr.length; --i > -1;) {
            if (item === arr[i]) return true;
        }
        return false;
    }
    observe.isFunction = function (obj) {
        return Object.prototype.toString.call(obj) == '[object Function]';
    }
    observe.twoWay = function (objA, aProp, objB, bProp) {
        if (typeof objA[aProp] === "object" && typeof objB[bProp] === "object") {
            observe(objA, aProp, function (name, value) {
                objB[bProp] = this[aProp];
            })
            observe(objB, bProp, function (name, value) {
                objA[aProp] = this[bProp];
            })
        } else {
            observe(objA, aProp, function (name, value) {
                objB[bProp] = value;
            })
            observe(objB, bProp, function (name, value) {
                objA[aProp] = value;
            })
        }
    }
    observe._getRootName = function (prop, path) {
        if (path === "#") {
            return prop;
        }
        return path.split("-")[1];
    }

    observe.add = function (obj, prop, value) {
        obj[prop] = value;
        var $observer = obj.$observer;
        $observer.watch(obj, prop);
    }
    Array.prototype.size = function (length) {
        this.length = length;
    }


var svgNS = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";
var $ = function (el, attr) {
    if (attr) {
        if (typeof el == "string") {
            el = $(el);
        }
        for (var key in attr) if (attr.hasOwnProperty(key)) {
            if (key.substring(0, 6) == "xlink:") {
                el.setAttributeNS(xlink, key.substring(6), String(attr[key]));
            } else {
                el.setAttribute(key, String(attr[key]));
            }
        }
    } else {
        el = document.createElementNS("http://www.w3.org/2000/svg", el);
        el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        el.opacity = el.scaleX = el.scaleY = 1;
        el.left = el.top = el.rotation = el.skewX = el.skewY = el.originX = el.originY = 0;
        el.matrix = Matrix2D.identity;
        observe(el, ["left", "top", "scaleX", "scaleY", "rotation", "skewX", "skewY", "originX", "originY"], function () {

            this.matrix.identity().appendTransform(this.left, this.top, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY);
              
            $(el, { "transform": "matrix(" + this.matrix.a + "," + this.matrix.b + "," + this.matrix.c + "," + this.matrix.d + "," + this.matrix.tx + "," + this.matrix.ty + ")" })
        })

        observe(el, ["opacity"], function () {
            el.setAttribute("opacity", this.opacity);         
        })

        el.attr = function (attr,value) {
            if (arguments.length === 1) {
                if (typeof attr === "string") {
                    if (attr.indexOf(":") !== -1) {
                        return this.getAttributeNS(svgNS, attr);
                    } else {
                        return this.getAttribute(attr);
                    }
                } else {
                    return $(this, attr);
                }
            } else {
                var obj={};
                obj[attr]=value;
                return $(this, obj);
            }

        }
    }

    return el;
};

var _Sword = function (selector, width, height) {
    this.parent = typeof selector === "string" ? document.querySelector(selector) : selector;
    this.svg = document.createElementNS(svgNS, "svg");
    //debug  'style', 'border: 1px solid black;
    this.svg.setAttribute('style', 'border: 1px solid black;overflow: hidden;');

    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.parent.appendChild(this.svg);

}   

_Sword.prototype = {
    line: function (x1, y1, x2, y2, color) {
        var line = $("line", { x1: x1, y1: y1, x2: x2, y2: y2 });
        this.svg.appendChild(line)
            
        return line;
    },
    rect: function (width,height) {
        var rect = $("rect", { width: width, height: height});
        this.svg.appendChild(rect)

        return rect;
    },
    text: function (str, font) {
        var text = $("text");
        text.style.font = font;
        text.textContent = str;
        this.svg.appendChild(text)
        return text;
    },
    circle: function (r) {
        var circle = $("circle", {r:r });
        this.svg.appendChild(circle);
        return circle;
    },
    //   image   group
    path: function (d) {

        var path = $("path", { d: d });
        path.to = _Sword.pathTo;
        this.svg.appendChild(path);
        return path;
    },
    ellipse: function (rx,ry) {

        var ellipse = $("ellipse", { rx:rx,ry:ry });
        this.svg.appendChild(ellipse);
        return ellipse;
    },
    image: function (imgOrSrc) {
        if (typeof imgOrSrc === "string") {
            var image = $("image", { "xlink:href": imgOrSrc });
            var tempImage = new Image();
            tempImage.onload = function () {
                image.attr({ width: tempImage.width, height: tempImage.height });
                tempImage = null;
            }
            tempImage.src = imgOrSrc;
        } else {
            var image = $("image", { "xlink:href": imgOrSrc, width: imgOrSrc.width, height: imgOrSrc.height });
            
        }
        this.svg.appendChild(image);
        return image;
     
       
    },
    group: function () {
        var group = $("g");
        this.svg.appendChild(group);
        var i=0,len=arguments.length;
        for( ;i<len;i++){
            group.appendChild(arguments[i]);
        }
        group.add = function (child) {
            group.appendChild(child);
        }
        group.remove = function (child) {
            group.removeChild(child);
        }
        return group;
    },
    remove: function (child) {
        this.svg.removeChild(child);
    }
}

var Sword = function (selector, width, height) {
    
    return new _Sword(selector, width, height)
}

; (function () {
    function repush(array, item) {
        for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
            return array.push(array.splice(i, 1)[0]);
        }
    }
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array.prototype.slice.call(arguments, 0),
                args = arg.join("\u2400"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache.hasOwnProperty(args)) {
                repush(count, args);
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count.length >= 1e3 && delete cache[count.shift()];
            count.push(args);
            cache[args] = f.apply(scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
    function clone(obj) {
        if (typeof obj == "function" || Object(obj) !== obj) {
            return obj;
        }
        var res = new obj.constructor;
        for (var key in obj) if (obj.hasOwnProperty(key)) {
            res[key] = clone(obj[key]);
        }
        return res;
    }
    var _path2string = function () {
        return this.join(",").replace(/,?([achlmqrstvxz]),?/gi, "$1");
    }
    var pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig;
    var pathClone = function (pathArray) {
        var res = clone(pathArray);
        res.toString = _path2string;
        return res;
    };
    var pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig;
    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    var upperCase = String.prototype.toUpperCase
    var parsePathString = function (pathString) {
        if (!pathString) {
            return null;
        }
        var pth = paths(pathString);
        if (pth.arr) {
            return pathClone(pth.arr);
        }

        var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 },
            data = [];
        if (isArray(pathString) && isArray(pathString[0])) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data.length) {
            String(pathString).replace(pathCommand, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b].concat(params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                if (name == "r") {
                    data.push([b].concat(params));
                } else while (params.length >= paramCounts[name]) {
                    data.push([b].concat(params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data.toString = _path2string;
        pth.arr = pathClone(data);
        return data;
    }
    var pathToAbsolute = function (pathArray) {
        var pth = paths(pathArray);
        if (pth.abs) {
            return pathClone(pth.abs);
        }
        if (!isArray(pathArray) || !isArray(pathArray && pathArray[0])) { // rough assumption
            pathArray = parsePathString(pathArray);
        }
        if (!pathArray || !pathArray.length) {
            return [["M", 0, 0]];
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0;
        if (pathArray[0][0] == "M") {
            x = +pathArray[0][1];
            y = +pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = ["M", x, y];
        }
        var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
        for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
            res.push(r = []);
            pa = pathArray[i];
            if (pa[0] != upperCase.call(pa[0])) {
                r[0] = upperCase.call(pa[0]);
                switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] + x);
                        r[7] = +(pa[7] + y);
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y].concat(pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res.concat(catmullRom2bezier(dots, crz));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + ((j % 2) ? x : y);
                        }
                }
            } else if (pa[0] == "R") {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ["R"].concat(pa.slice(-2));
            } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    r[k] = pa[k];
                }
            }
            switch (r[0]) {
                case "Z":
                    x = mx;
                    y = my;
                    break;
                case "H":
                    x = r[1];
                    break;
                case "V":
                    y = r[1];
                    break;
                case "M":
                    mx = r[r.length - 2];
                    my = r[r.length - 1];
                default:
                    x = r[r.length - 2];
                    y = r[r.length - 1];
            }
        }
        res.toString = _path2string;
        pth.abs = pathClone(res);
        return res;
    };
    var paths = function (ps) {
        var p = paths.ps = paths.ps || {};
        if (p[ps]) {
            p[ps].sleep = 100;
        } else {
            p[ps] = {
                sleep: 100
            };
        }
        setTimeout(function () {
            for (var key in p) if (p.hasOwnProperty(key) && key != ps) {
                p[key].sleep--;
                !p[key].sleep && delete p[key];
            }
        });
        return p[ps];
    };
    var l2c = function (x1, y1, x2, y2) {
        return [x1, y1, x2, y2, x2, y2];
    }
    var path2curve = cacher(function (path, path2) {
        var pth = !path2 && paths(path);
        if (!path2 && pth.curve) {
            return pathClone(pth.curve);
        }
        var p = pathToAbsolute(path),
            p2 = path2 && pathToAbsolute(path2),
            attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
            attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
            processPath = function (path, d, pcom) {
                var nx, ny, tq = { T: 1, Q: 1 };
                if (!path) {
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                }
                !(path[0] in tq) && (d.qx = d.qy = null);
                switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"].concat(a2c[apply](0, [d.x, d.y].concat(path.slice(1))));
                        break;
                    case "S":
                        if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
                            nx = d.x * 2 - d.bx;          // And reflect the previous
                            ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                        }
                        else {                            // or some else or nothing
                            nx = d.x;
                            ny = d.y;
                        }
                        path = ["C", nx, ny].concat(path.slice(1));
                        break;
                    case "T":
                        if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
                            d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                            d.qy = d.y * 2 - d.qy;        // to case "S".
                        }
                        else {                            // or something else or nothing
                            d.qx = d.x;
                            d.qy = d.y;
                        }
                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                        break;
                }
                return path;
            },
            fixArc = function (pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = Math.max(p.length, p2 && p2.length || 0);
                }
            },
            fixM = function (path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = Math.max(p.length, p2 && p2.length || 0);
                }
            },
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0) ; i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command

            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
                p2[i] && (pfirst = p2[i][0]);
                if (pfirst != "C") {
                    pcoms2[i] = pfirst;
                    i && (pcom = pcoms2[i - 1]);
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] != "A" && pfirst == "C") pcoms2[i] = "C";

                fixArc(p2, i);
            }
            fixM(p, p2, attrs, attrs2, i);
            fixM(p2, p, attrs2, attrs, i);
            var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
        }
        if (!p2) {
            pth.curve = pathClone(p);
        }
        return p2 ? [p, p2] : p;
    }, null, pathClone)


    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();



    function pathTo(path, ms, ease) {
        var element = this;
        var start = Date.now();
        var pathes = path2curve(element.attr("d"), path);
        var toD = pathes[1];

        fromD = pathes[0];
        diffD = [];
        for (var i = 0, ii = fromD.length; i < ii; i++) {
            diffD[i] = [0];
            for (var j = 1, jj = fromD[i].length; j < jj; j++) {
                diffD[i][j] = (toD[i][j] - fromD[i][j]) / ms;
            }
        }

        var animPath = function (element, path, ms, ease) {

            var time = Date.now() - start;
          
            var pos = time / ms;

            if (pos > 1) {
                pos = 1;
                element.attr("d", path);
            } else {
                var now = [];

                for (var i = 0, ii = fromD.length; i < ii; i++) {
                    now[i] = [fromD[i][0]];
                    for (var j = 1, jj = fromD[i].length; j < jj; j++) {
                        now[i][j] = +fromD[i][j] + pos * ms * diffD[i][j];
                    }
                    now[i] = now[i].join(" ");
                }
                now = now.join(" ");
                element.attr("d", now);
            }
          
               
           
        if(pos!==1)
            requestAnimFrame(function () {
                animPath(element, path, ms, ease);
            });
        }

        animPath(element, path, ms, ease);
    }


     _Sword.pathTo = pathTo;
})();


return Sword;
}));