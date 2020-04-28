import BaseObject from './base-object'

class Rect extends BaseObject {
  constructor(width, height) {
    super()
    this.width = width
    this.height = height

    this.ele = document.createElementNS("http://www.w3.org/2000/svg", 'text')


  }
}


export default Text
