import Matrix2D from './matrix2d'
import obaa from './obaa'
import Stage from './stage'
import Text from './Text'

var svgNS = "http://www.w3.org/2000/svg"
var xlink = "http://www.w3.org/1999/xlink"
var $ = function (el, attr) {
  if (attr) {
    if (typeof el == "string") {
      el = $(el)
    }
    for (var key in attr) if (attr.hasOwnProperty(key)) {
      if (key.substring(0, 6) == "xlink:") {
        el.setAttributeNS(xlink, key.substring(6), String(attr[key]))
      } else {
        el.setAttribute(key, String(attr[key]))
      }
    }
  } else {
    el = document.createElementNS(svgNS, el)
    el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)")
    el.opacity = el.scaleX = el.scaleY = 1
    el.left = el.top = el.rotation = el.skewX = el.skewY = el.originX = el.originY = 0
    el.matrix = Matrix2D.identity
    obaa(el, ["left", "top", "scaleX", "scaleY", "rotation", "skewX", "skewY", "originX", "originY"], function () {

      this.matrix.identity().appendTransform(this.left, this.top, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY)

      $(el, { "transform": "matrix(" + this.matrix.a + "," + this.matrix.b + "," + this.matrix.c + "," + this.matrix.d + "," + this.matrix.tx + "," + this.matrix.ty + ")" })
    })

    obaa(el, ["opacity"], function () {
      el.setAttribute("opacity", this.opacity)
    })

    el.attr = function (attr, value) {
      if (arguments.length === 1) {
        if (typeof attr === "string") {
          if (attr.indexOf(":") !== -1) {
            return this.getAttributeNS(svgNS, attr)
          } else {
            return this.getAttribute(attr)
          }
        } else {
          return $(this, attr)
        }
      } else {
        var obj = {}
        obj[attr] = value
        return $(this, obj)
      }

    }
  }

  return el
}

var _Sving = function (selector, width, height) {
  this.parent = typeof selector === "string" ? document.querySelector(selector) : selector
  this.svg = document.createElementNS(svgNS, "svg")
  //debug  'style', 'border: 1px solid black
  this.svg.setAttribute('style', 'border: 1px solid blackoverflow: hidden')

  this.svg.setAttribute('width', width)
  this.svg.setAttribute('height', height)
  this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
  this.parent.appendChild(this.svg)

}

_Sving.prototype = {
  line: function (x1, y1, x2, y2, color) {
    var line = $("line", { x1: x1, y1: y1, x2: x2, y2: y2 })
    this.svg.appendChild(line)

    return line
  },
  rect: function (width, height) {
    var rect = $("rect", { width: width, height: height })
    this.svg.appendChild(rect)

    return rect
  },
  text: function (str, font) {
    var text = $("text")
    text.style.font = font
    text.textContent = str
    this.svg.appendChild(text)
    return text
  },
  circle: function (r) {
    var circle = $("circle", { r: r })
    this.svg.appendChild(circle)
    return circle
  },
  //   image   group
  path: function (d) {

    var path = $("path", { d: d })
    path.to = _Sving.pathTo
    this.svg.appendChild(path)
    return path
  },
  ellipse: function (rx, ry) {

    var ellipse = $("ellipse", { rx: rx, ry: ry })
    this.svg.appendChild(ellipse)
    return ellipse
  },
  image: function (imgOrSrc) {
    if (typeof imgOrSrc === "string") {
      var image = $("image", { "xlink:href": imgOrSrc })
      var tempImage = new Image()
      tempImage.onload = function () {
        image.attr({ width: tempImage.width, height: tempImage.height })
        tempImage = null
      }
      tempImage.src = imgOrSrc
    } else {
      var image = $("image", { "xlink:href": imgOrSrc, width: imgOrSrc.width, height: imgOrSrc.height })

    }
    this.svg.appendChild(image)
    return image


  },
  group: function () {
    var group = $("g")
    this.svg.appendChild(group)
    var i = 0, len = arguments.length
    for (; i < len; i++) {
      group.appendChild(arguments[i])
    }
    group.add = function (child) {
      group.appendChild(child)
    }
    group.remove = function (child) {
      group.removeChild(child)
    }
    return group
  },
  remove: function (child) {
    this.svg.removeChild(child)
  }
}

var sving = function (selector, width, height) {

  return new _Sving(selector, width, height)
}


sving.Stage = Stage
sving.Text = Text

export default sving
