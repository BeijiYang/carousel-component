import { Component, createElement } from './framework';

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  // attributes 不是给 root 用的，所以重写 setAttribute 覆盖
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    console.log(this.attributes)
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const src of this.attributes.src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${src})`;
      this.root.appendChild(child);
    }
    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const ids = ['1043', '1044', '996', '220'];
const urlOf = id => `https://picsum.photos/id/${id}/500/300`;

const a = <Carousel src={ids.map(urlOf)} />

a.mountTo(document.body);

