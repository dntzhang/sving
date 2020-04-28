!function() {
    'use strict';
    function Matrix2D(a, b, c, d, tx, ty) {
        this.setValues(a, b, c, d, tx, ty);
    }
    function obaa(target, arr, callback) {
        var eventPropArr = [];
        if (isArray(target)) {
            if (0 === target.length) target.f = {
                g: target,
                h: '#'
            };
            mock(target, target);
        }
        if (target && 'object' == typeof target && 0 === Object.keys(target).length) {
            track(target);
            target.f.g = target;
        }
        for (var prop in target) if (target.hasOwnProperty(prop)) if (callback) {
            if (isArray(arr) && isInArray(arr, prop)) {
                eventPropArr.push(prop);
                watch(target, prop, null, target);
            } else if (isString(arr) && prop == arr) {
                eventPropArr.push(prop);
                watch(target, prop, null, target);
            }
        } else {
            eventPropArr.push(prop);
            watch(target, prop, null, target);
        }
        if (!target.i) target.i = [];
        var propChanged = callback ? callback : arr;
        target.i.push({
            all: !callback,
            propChanged: propChanged,
            eventPropArr: eventPropArr
        });
    }
    function mock(target, root) {
        methods.forEach(function(item) {
            target[item] = function() {
                var old = Array.prototype.slice.call(this, 0);
                var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                if (new RegExp('\\b' + item + '\\b').test(triggerStr)) {
                    for (var cprop in this) if (this.hasOwnProperty(cprop) && !isFunction(this[cprop])) watch(this, cprop, this.f.h, root);
                    onPropertyChanged('Array-' + item, this, old, this, this.f.h, root);
                }
                return result;
            };
            target['pure' + item.substring(0, 1).toUpperCase() + item.substring(1)] = function() {
                return Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
            };
        });
    }
    function watch(target, prop, path, root) {
        if ('__o_' !== prop) if (!isFunction(target[prop])) {
            if (!target.f) target.f = {
                g: root
            };
            if (void 0 !== path && null !== path) target.f.h = path; else target.f.h = '#';
            var currentValue = target.f[prop] = target[prop];
            Object.defineProperty(target, prop, {
                get: function() {
                    return this.f[prop];
                },
                set: function(value) {
                    var old = this.f[prop];
                    this.f[prop] = value;
                    onPropertyChanged(prop, value, old, this, target.f.h, root);
                },
                configurable: !0,
                enumerable: !0
            });
            if ('object' == typeof currentValue) {
                if (isArray(currentValue)) {
                    mock(currentValue, root);
                    if (0 === currentValue.length) track(currentValue, prop, path);
                }
                if (currentValue && 0 === Object.keys(currentValue).length) track(currentValue, prop, path);
                for (var cprop in currentValue) if (currentValue.hasOwnProperty(cprop)) watch(currentValue, cprop, target.f.h + '-' + prop, root);
            }
        }
    }
    function track(obj, prop, path) {
        if (!obj.f) {
            obj.f = {};
            if (void 0 !== path && null !== path) obj.f.h = path + '-' + prop; else if (void 0 !== prop && null !== prop) obj.f.h = "#-" + prop; else obj.f.h = '#';
        }
    }
    function onPropertyChanged(prop, value, oldValue, target, path, root) {
        if (value !== oldValue && (!nan(value) || !nan(oldValue)) && root.i) {
            var rootName = getRootName(prop, path);
            for (var i = 0, len = root.i.length; i < len; i++) {
                var handler = root.i[i];
                if (handler.all || isInArray(handler.eventPropArr, rootName) || 0 === rootName.indexOf('Array-')) handler.propChanged.call(target, prop, value, oldValue, path);
            }
        }
        if (0 !== prop.indexOf('Array-') && 'object' == typeof value) watch(target, prop, target.f.h, root);
    }
    function isFunction(obj) {
        return '[object Function]' == Object.prototype.toString.call(obj);
    }
    function nan(value) {
        return "number" == typeof value && isNaN(value);
    }
    function isArray(obj) {
        return '[object Array]' === Object.prototype.toString.call(obj);
    }
    function isString(obj) {
        return 'string' == typeof obj;
    }
    function isInArray(arr, item) {
        for (var i = arr.length; --i > -1; ) if (item === arr[i]) return !0;
        return !1;
    }
    function getRootName(prop, path) {
        if ('#' === path) return prop; else return path.split('-')[1];
    }
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _classCallCheck$1(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    Matrix2D.identity = null;
    Matrix2D.prototype = {
        setValues: function(a, b, c, d, tx, ty) {
            this.a = null == a ? 1 : a;
            this.b = b || 0;
            this.c = c || 0;
            this.d = null == d ? 1 : d;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        },
        append: function(a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (1 != a || 0 != b || 0 != c || 1 != d) {
                this.a = a1 * a + c1 * b;
                this.b = b1 * a + d1 * b;
                this.c = a1 * c + c1 * d;
                this.d = b1 * c + d1 * d;
            }
            this.tx = a1 * tx + c1 * ty + this.tx;
            this.ty = b1 * tx + d1 * ty + this.ty;
            return this;
        },
        appendTransform: function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * Matrix2D.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                skewX *= Matrix2D.DEG_TO_RAD;
                skewY *= Matrix2D.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            } else this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            if (regX || regY) {
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        },
        identity: function() {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        },
        copy: function(matrix) {
            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        },
        clone: function() {
            return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
        },
        toString: function() {
            return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
        }
    };
    Matrix2D.identity = new Matrix2D();
    var triggerStr = [ 'concat', 'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'size' ].join(',');
    var methods = [ 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort', 'splice', 'toLocaleString', 'toString', 'unshift', 'values', 'size' ];
    obaa.add = function(obj, prop) {
        watch(obj, prop, obj.f.h, obj.f.g);
    };
    obaa.set = function(obj, prop, value) {
        if (void 0 === obj[prop]) watch(obj, prop, obj.f.h, obj.f.g);
        obj[prop] = value;
    };
    Array.prototype.size = function(length) {
        this.length = length;
    };
    var Stage = function() {
        function Stage(selector, width, height) {
            _classCallCheck(this, Stage);
            this.parent = "string" == typeof selector ? document.querySelector(selector) : selector;
            this.svg = document.createElementNS(svgNS, "svg");
            this.svg.setAttribute('width', width);
            this.svg.setAttribute('height', height);
            this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            this.parent.appendChild(this.svg);
            this.children = [];
        }
        Stage.prototype.add = function(child) {
            this.children.push(child);
            this.svg.append(child);
        };
        return Stage;
    }();
    var Text = function Text(text, font) {
        _classCallCheck$1(this, Text);
        this.text = text;
        this.font = font;
        this.ele = null;
    };
    var svgNS$1 = "http://www.w3.org/2000/svg";
    var $ = function $(el, attr) {
        if (attr) {
            if ("string" == typeof el) el = $(el);
            for (var key in attr) if (attr.hasOwnProperty(key)) if ("xlink:" == key.substring(0, 6)) el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), String(attr[key])); else el.setAttribute(key, String(attr[key]));
        } else {
            el = document.createElementNS("http://www.w3.org/2000/svg", el);
            el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
            el.opacity = el.scaleX = el.scaleY = 1;
            el.left = el.top = el.rotation = el.skewX = el.skewY = el.originX = el.originY = 0;
            el.matrix = Matrix2D.identity;
            obaa(el, [ "left", "top", "scaleX", "scaleY", "rotation", "skewX", "skewY", "originX", "originY" ], function() {
                this.matrix.identity().appendTransform(this.left, this.top, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY);
                $(el, {
                    transform: "matrix(" + this.matrix.a + "," + this.matrix.b + "," + this.matrix.c + "," + this.matrix.d + "," + this.matrix.tx + "," + this.matrix.ty + ")"
                });
            });
            obaa(el, [ "opacity" ], function() {
                el.setAttribute("opacity", this.opacity);
            });
            el.attr = function(attr, value) {
                if (1 === arguments.length) if ("string" == typeof attr) if (-1 !== attr.indexOf(":")) return this.getAttributeNS(svgNS$1, attr); else return this.getAttribute(attr); else return $(this, attr); else {
                    var obj = {};
                    obj[attr] = value;
                    return $(this, obj);
                }
            };
        }
        return el;
    };
    var _Sving = function(selector, width, height) {
        this.parent = "string" == typeof selector ? document.querySelector(selector) : selector;
        this.svg = document.createElementNS(svgNS$1, "svg");
        this.svg.setAttribute('style', 'border: 1px solid blackoverflow: hidden');
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.parent.appendChild(this.svg);
    };
    _Sving.prototype = {
        line: function(x1, y1, x2, y2, color) {
            var line = $("line", {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            });
            this.svg.appendChild(line);
            return line;
        },
        rect: function(width, height) {
            var rect = $("rect", {
                width: width,
                height: height
            });
            this.svg.appendChild(rect);
            return rect;
        },
        text: function(str, font) {
            var text = $("text");
            text.style.font = font;
            text.textContent = str;
            this.svg.appendChild(text);
            return text;
        },
        circle: function(r) {
            var circle = $("circle", {
                r: r
            });
            this.svg.appendChild(circle);
            return circle;
        },
        path: function(d) {
            var path = $("path", {
                d: d
            });
            path.to = _Sving.pathTo;
            this.svg.appendChild(path);
            return path;
        },
        ellipse: function(rx, ry) {
            var ellipse = $("ellipse", {
                rx: rx,
                ry: ry
            });
            this.svg.appendChild(ellipse);
            return ellipse;
        },
        image: function(imgOrSrc) {
            if ("string" == typeof imgOrSrc) {
                var image = $("image", {
                    "xlink:href": imgOrSrc
                });
                var tempImage = new Image();
                tempImage.onload = function() {
                    image.attr({
                        width: tempImage.width,
                        height: tempImage.height
                    });
                    tempImage = null;
                };
                tempImage.src = imgOrSrc;
            } else var image = $("image", {
                "xlink:href": imgOrSrc,
                width: imgOrSrc.width,
                height: imgOrSrc.height
            });
            this.svg.appendChild(image);
            return image;
        },
        group: function() {
            var group = $("g");
            this.svg.appendChild(group);
            var i = 0, len = arguments.length;
            for (;i < len; i++) group.appendChild(arguments[i]);
            group.add = function(child) {
                group.appendChild(child);
            };
            group.remove = function(child) {
                group.removeChild(child);
            };
            return group;
        },
        remove: function(child) {
            this.svg.removeChild(child);
        }
    };
    var sving = function(selector, width, height) {
        return new _Sving(selector, width, height);
    };
    sving.Stage = Stage;
    sving.Text = Text;
    if ('undefined' != typeof module) module.exports = sving; else self.sving = sving;
}();
//# sourceMappingURL=sving.js.map