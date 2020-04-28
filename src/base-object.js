class BaseObject {
  constructor() {
    this.opacity = this.scaleX = this.scaleY = 1
    this.tx = this.ty = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0

    this.ele = null
  }

  setAttrs(attrs) {
    for (var key in attrs) {
      if (attr.hasOwnProperty(key)) {
        if (key.substring(0, 6) == "xlink:") {
          el.setAttributeNS(xlink, key.substring(6), String(attr[key]))
        } else {
          el.setAttribute(key, String(attr[key]))
        }
      }
    }
  }

  getAttr(attr) {
    if (attr.indexOf(":") !== -1) {
      return this.getAttributeNS(svgNS, attr)
    } else {
      return this.getAttribute(attr)
    }

  }
}


export default BaseObject
