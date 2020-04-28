
class Group {
  constructor() {

  }

  add(child) {
    this.children.push(child)
    this.svg.append(child.ele)
  }


  swap(childA, childB) {

  }
}


export default Group


