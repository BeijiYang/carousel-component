import { Component } from './framework';

export class Carousel extends Component {
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
        const children = this.root.children;
        const movedX = clientX - initX;
        // 当前元素的位置
        const current = position - (movedX - movedX % 500) / 500
        // 不去算往左还是往右，把 -1 和 1 都加上。即把当前元素，与其两边的元素都移动到正确位置上去
        for (const offset of [-1, 0, 1]) {
          const pos = current + offset;
          pos = (pos + children.length) % children.length; // 四个元素，0 1 2 3。0 的前一个是 3。这个计算就是把 -1 变成 3， 把 -2 变成 2。用取余处理循环的小技巧。

          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + (offset * 500) + (movedX % 500)}px)`;
        }
      }
      const mouseup = ({ clientX }) => {
        const children = this.root.children;
        const movedX = clientX - initX;
        position -= Math.round(movedX / 500);

        for (const offset of [0, -Math.sign(Math.round(movedX / 500 - movedX + 250 * Math.sign(movedX)))]) { // sign 取符号；x / 500 - x 算方向; + 250 * 符号，看有没有超过半个图片长度  
          const pos = position + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', mouseup)
      }
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', mouseup)
    })
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
