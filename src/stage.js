const svgNS = "http://www.w3.org/2000/svg"

class Stage {
  constructor(selector, width, height) {
    this.parent = typeof selector === "string" ? document.querySelector(selector) : selector
    this.svg = document.createElementNS(svgNS, "svg")
    //debug  'style', 'border: 1px solid black
    //this.svg.setAttribute('style', 'border: 1px solid blackoverflow: hidden')

    this.svg.setAttribute('width', width)
    this.svg.setAttribute('height', height)
    this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
    this.parent.appendChild(this.svg)
    this.children = []
  }

  add(child) {
    this.children.push(child)
    this.svg.append(child.ele)
  }

  //can't change z-index, use svg2 z-order ?
  //https://stackoverflow.com/questions/17786618/how-to-use-z-index-in-svg-elements
  swap(childA, childB) {

    var cloneA = childA.ele.cloneNode(true)
    var cloneB = childB.ele.cloneNode(true)

    childB.ele.parentNode.replaceChild(cloneA, childB.ele)
    childA.ele.parentNode.replaceChild(cloneB, childA.ele)

  }
}


export default Stage
