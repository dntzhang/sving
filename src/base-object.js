import obaa from './obaa'
import Matrix2D from './matrix2d'

const svgNS = "http://www.w3.org/2000/svg"
const xlink = "http://www.w3.org/1999/xlink"

class BaseObject {
  constructor() {
    this.opacity = this.scaleX = this.scaleY = 1
    this.left = this.top = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0

    this.matrix = Matrix2D.identity

    this.ele = null

    obaa(this, ["left", "top", "scaleX", "scaleY", "rotation", "skewX", "skewY", "originX", "originY"], () => {

      this.matrix.identity().appendTransform(this.left, this.top, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY)

      this.setAttrs({
        "transform": "matrix(" + this.matrix.a + "," + this.matrix.b + "," + this.matrix.c + "," + this.matrix.d + "," + this.matrix.tx + "," + this.matrix.ty + ")"
      })
    })

    obaa(this, ["opacity"], () => {
      this.setAttrs({ "opacity": this.opacity })
    })

  }

  setAttrs(attrs) {
    const el = this.ele
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (key.substring(0, 6) == "xlink:") {
          el.setAttributeNS(xlink, key.substring(6), String(attrs[key]))
        } else {
          el.setAttribute(key, String(attrs[key]))
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
