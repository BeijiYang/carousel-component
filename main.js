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

    // let currentIndex = 0;
    // setInterval(() => {
    //   const children = this.root.children;
    //   const nextIndex = (currentIndex + 1) % children.length;
    //   // console.log(currentIndex, nextIndex)
    //   const current = children[currentIndex];
    //   const next = children[nextIndex];

    //   next.style.transition = 'none';
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = '';
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(-${nextIndex * 100}%)`;
    //     currentIndex = nextIndex;
    //   }, 160);

    // }, 1500);
    this.draggable();
    return this.root;
  }

  draggable() {
    let position = 0;
    this.root.addEventListener('mousedown', ({ clientX: initX }) => {
      const drag = ({ clientX }) => {
        const movedX = clientX - initX;
        // todo 同时拖动了四个，两个就足够了
        for (const child of this.root.children) {
          child.style.transition = 'none';
          const { width } = child.getClientRects()[0]; // 500 todo getClientRects
          child.style.transform = `translateX(${position * width + movedX}px)`;
        }
      }
      const mouseup = ({ clientX }) => {
        const movedX = clientX - initX;
        position += Math.round(movedX / 500);

        for (const child of this.root.children) {
          child.style.transition = '';
          child.style.transform = `translateX(${position * 500}px)`;
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', mouseup)
      }

      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', mouseup)
    })




    // const children = this.root.children;
    // for (const child of children) {
    //   child.addEventListener('mousedown', ({ clientX: initX }) => {
    //     const drag = ({ clientX }) => {
    //       const movedX = clientX - initX;
    //       child.style.transform = `translateX(${movedX}px)`;
    //     }
    //     const mouseup = () => {
    //       child.style.transform = `translateX(${0}px)`;
    //       document.removeEventListener('mousemove', drag);
    //       document.removeEventListener('mouseup', mouseup)
    //     }

    //     document.addEventListener('mousemove', drag);
    //     document.addEventListener('mouseup', mouseup)
    //   })
    // }
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const ids = ['1043', '1044', '996', '220'];
const urlOf = id => `https://picsum.photos/id/${id}/500/300`;

const a = <Carousel src={ids.map(urlOf)} />

a.mountTo(document.body);
