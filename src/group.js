import BaseObject from './base-object'

class Group extends BaseObject {
  constructor() {
    this.ele = document.createElementNS("http://www.w3.org/2000/svg", 'g')
  }

  add(child) {
    this.children.push(child)
    this.svg.append(child.ele)
  }


  swap(childA, childB) {

  }
}


export default Group


