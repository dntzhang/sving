import BaseObject from './base-object'

class Text extends BaseObject {
  constructor(textContent, font) {
    super()
    this.textContent = textContent
    this.font = font

    this.ele = document.createElementNS("http://www.w3.org/2000/svg", 'text')

    this.ele.style.font = font
    this.ele.textContent = textContent
  }
}


export default Text
