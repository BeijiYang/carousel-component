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
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const src of this.attributes.src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url(${src})`;
      this.root.appendChild(child);
    }

    let currentIndex = 0;
    setInterval(() => {
      const children = this.root.children;
      const nextIndex = (currentIndex + 1) % children.length;
      // console.log(currentIndex, nextIndex)
      const current = children[currentIndex];
      const next = children[nextIndex];

      next.style.transition = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        next.style.transition = '';
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(-${nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 160);

    }, 1500);

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
