const TICK = Symbol('tick'); // 利用 Symbol 的唯一性确保私有，外部代码无法访问
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set(); // animation 的队列
    this[START_TIME] = new Map();
  }

  start() {
    const startTime = Date.now();

    this[TICK] = () => {
      const now = Date.now(); // 因 Date.now() 时刻变化，用变量存下这个值。

      for (const animation of this[ANIMATIONS]) {
        const elapsedTime = (this[START_TIME].get(animation) < startTime)
          ? now - startTime
          : now - this[START_TIME].get(animation);

        if (elapsedTime > animation.duration) {
          this[ANIMATIONS].delete(animation);
          elapsedTime = animation.duration; // 当 time 大于 duration，保证 animation receive 到的最后的 time 不超过 duration。
        }
        animation.receive(elapsedTime);  // 接收一个相对的时间，目前距离开始时过了多久
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

  // 把 animation 添加进 timeline; startTime 可手动设置一个 delay 的值
  add(animation, startTime = Date.now()) {
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }

  // set rate() {}
  // get rate() {}
}

export class Animation {
  // 属性动画参数
  constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
  }

  receive(time) {
    const range = this.endValue - this.startValue;
    this.object[this.property] = this.startValue + range * (time / this.duration); // 均匀变化
  }
}