
function Matrix2D(a, b, c, d, tx, ty) {
  this.setValues(a, b, c, d, tx, ty)
}

Matrix2D.DEG_TO_RAD = Math.PI / 180


Matrix2D.identity = null // set at bottom of class definition.
Matrix2D.prototype = {
  setValues: function (a, b, c, d, tx, ty) {
    // don't forget to update docs in the constructor if these change:
    this.a = (a == null) ? 1 : a
    this.b = b || 0
    this.c = c || 0
    this.d = (d == null) ? 1 : d
    this.tx = tx || 0
    this.ty = ty || 0
    return this
  },

  append: function (a, b, c, d, tx, ty) {
    var a1 = this.a
    var b1 = this.b
    var c1 = this.c
    var d1 = this.d
    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = a1 * a + c1 * b
      this.b = b1 * a + d1 * b
      this.c = a1 * c + c1 * d
      this.d = b1 * c + d1 * d
    }
    this.tx = a1 * tx + c1 * ty + this.tx
    this.ty = b1 * tx + d1 * ty + this.ty
    return this
  },

  appendTransform: function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    if (rotation % 360) {
      var r = rotation * Matrix2D.DEG_TO_RAD
      var cos = Math.cos(r)
      var sin = Math.sin(r)
    } else {
      cos = 1
      sin = 0
    }

    if (skewX || skewY) {
      // TODO: can this be combined into a single append operation?
      skewX *= Matrix2D.DEG_TO_RAD
      skewY *= Matrix2D.DEG_TO_RAD
      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y)
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0)
    } else {
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
    }

    if (regX || regY) {
      this.tx -= regX * this.a + regY * this.c
      this.ty -= regX * this.b + regY * this.d
    }
    return this
  },

  identity: function () {
    this.a = this.d = 1
    this.b = this.c = this.tx = this.ty = 0
    return this
  },

  copy: function (matrix) {
    return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
  },

  clone: function () {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty)
  },

  toString: function () {
    return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
  }
}


Matrix2D.identity = new Matrix2D()


export default Matrix2D
