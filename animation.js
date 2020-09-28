const TICK = Symbol('tick'); // 利用 Symbol 的唯一性确保私有，外部代码无法访问
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations')

export class Timeline {
  constructor() {

    this[ANIMATIONS] = new Set(); // animation 的队列
  }

  start() {
    const startTime = Date.now();
    this[TICK] = () => {
      const time = Date.now() - startTime; // 相对的时间，目前距离开始时过了多久。因 Date.now() 时刻变化，用变量存下这个值。
      for (const animation of this[ANIMATIONS]) {
        let timeToReceive = time;
        if (time > animation.duration) {
          this[ANIMATIONS].delete(animation);
          timeToReceive = animation.duration; // 当 time 大于 duration，保证 animation receive 到的最后的 time 不超过 duration。
        }
        animation.receive(timeToReceive);  // 接收一个相对的时间，目前距离开始时过了多久
      }
      requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  pause() {

  }

  resume() {

  }

  reset() {

  }

  // 把 animation 添加进 timeline
  add(animation) {
    this[ANIMATIONS].add(animation);
  }

  // set rate() {}
  // get rate() {}
}

export class Animation {
  // 属性动画参数
  constructor(object, property, startValue, endValue, duration, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }

  receive(time) {
    const range = this.endValue - this.startValue;
    this.object[this.property] = this.startValue + range * (time / this.duration); // 均匀变化
  }
}