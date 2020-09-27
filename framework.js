export function createElement(type, attributes, ...children) {
  const element = typeof type === 'string'
    ? new ElementWrapper(type)
    : new type;

  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextNodeWrapper(child);
    }
    element.appendChild(child);
  }

  return element;
}

export class Component {
  constructor(type) {
    // this.root = this.render();
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextNodeWrapper extends Component {
  constructor(type) {
    this.root = document.createTextNode(type);
  }
}