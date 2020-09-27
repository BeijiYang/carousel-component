function createElement(type, attributes, ...children) {
  const element = typeof type === 'string'
    ? document.createElement(type)
    : new type;

  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }

  return element;
}

class Watch {
  constructor() {
    this.root = document.createElement('div');
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.root.appendChild(child);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}


const a = <Watch id="aa">
  <span>Hey</span>
  ~
</Watch>

// document.body.appendChild(a);
a.mountTo(document.body);

// var a = createElement("div", {
//     id: "aa"
//   },
//   createElement("span", null),
//   createElement("span", null),
//   createElement("span", null)
// );
