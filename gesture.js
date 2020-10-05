export function enableGesture(element) {
  new Listener(element, new Recoginzer(new Dispatcher(element)));
}

// 封装
// listen => recoginze => dispatch
// new Listener(new Recoginzer(dispatch))

export class Listener {
  constructor(element, recoginzer) {
    const contexts = new Map();
    let isListeningMouse = false;

    // 鼠标事件的监听
    element.addEventListener('mousedown', evt => {
      const context = Object.create(null);
      contexts.set(`mouse${1 << evt.button}`, context);
      recoginzer.start(evt, context);

      // mousedown、up 分按键，mousemove 不分按键。
      // 不过 mousemove 有 evt.buttons，表示有哪些键被按下来了。用掩码做的，用二进制表示的。
      const mousemove = evt => {
        // order of buttons & button property is not same.
        let button = 1;
        while (button <= evt.buttons) {
          // 按下去了 当掩码成立
          if (button & evt.buttons) {
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }

            const context = contexts.get(`mouse${key}`);
            recoginzer.move(evt, context);
          }
          button = button << 1;
        }
      }

      const mouseup = evt => {
        const context = contexts.get(`mouse${1 << evt.button}`);
        recoginzer.end(evt, context);
        contexts.delete(`mouse${1 << evt.button}`);

        if (evt.buttons === 0) { // 判断是否还有 key 在，当 buttons 完全空了？等于 0 了。
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }

      }
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });

    // 触屏事件的监听
    element.addEventListener('touchstart', evt => {
      for (const touch of evt.changedTouches) {
        const { clientX, clientY } = touch;

        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        recoginzer.start(touch, context);
      }
    })
    element.addEventListener('touchmove', evt => {
      for (const touch of evt.changedTouches) {
        const { clientX, clientY } = touch;
        const context = contexts.get(touch.identifier);
        recoginzer.move(touch, context);
      }
    })
    element.addEventListener('touchend', evt => {
      for (const touch of evt.changedTouches) {
        const { clientX, clientY } = touch;
        const context = contexts.get(touch.identifier);
        recoginzer.end(touch, context);
        contexts.delete(touch.identifier); // end() 之后
      }
    })
    element.addEventListener('touchcancel', evt => {
      for (const touch of evt.changedTouches) {
        const { clientX, clientY } = touch;
        const context = contexts.get(touch.identifier);
        recoginzer.cancel(touch);
        contexts.delete(touch.identifier);
      }
    })
  }
}

export class Recoginzer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  /**
 * start 时：
 * 1.默认是 tap
 * 2.是否过了0.5s，形成 press；
 */
  start(point, context) {
    const { clientX, clientY } = point;
    context.initX = clientX;
    context.initY = clientY;

    context.points = [{
      time: Date.now(),
      x: point.clientX,
      y: point.clientY
    }];

    context.isTap = true; // 默认是点击
    context.isPan = false;
    context.isPress = false;
    context.isFlick = false;

    context.handler = setTimeout(() => { // 判断是否是长按
      context.isPress = true;
      context.isTap = false;
      context.isPan = false;
      context.handler = null;
      this.dispatcher.dispatch('press', {});
    }, 500);
  }

  move(point, context) {
    const { clientX, clientY } = point;
    const movedX = clientX - context.initX;
    const movedY = clientY - context.initY;

    // 判断是否是拖动（移动距离大于 10 px）
    if (!context.isPan && (movedX ** 2 + movedY ** 2 > 100)) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(movedX) < Math.abs(movedY) // 区分用户是上下滑动还是左右滑动

      // 开始拖动 pan start
      this.dispatcher.dispatch('panstart', {
        initX: context.initX,
        initY: context.initY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(context.handler);
    }

    // 拖动过程中 pan 
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        initX: context.initX,
        initY: context.initY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
    }

    // 记录最后一段的拖动经过的点
    // points 中只存储半秒内的点，这样 end 方法中用 points 中存储的点算出的就总是最新的一段速度
    context.points = context.points.filter(point => Date.now() - point.time < 500);
    context.points.push({
      time: Date.now(),
      x: point.clientX,
      y: point.clientY
    });
  }

  end(point, context) {
    const { clientX, clientY } = point;
    // 当是 tap
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {});
      clearTimeout(context.handler);
    }
    // 当是 pressend
    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {});
    }

    // 判断是否是 flick
    context.points = context.points.filter(point => Date.now() - point.time < 500);
    let speed;
    if (!context.points.length) {
      speed = 0;
    } else {
      const distance = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
      speed = distance / (Date.now() - context.points[0].time);
    }

    // 当速度大于 1.5 像素每毫秒，判定为 flick
    context.isFlick = speed > 1.5;
    if (context.isFlick) {
      this.dispatcher.dispatch('flick', {
        initX: context.initX,
        initY: context.initY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        speed,
      });
    }

    // 当是 panend，即拖动事件结束。此时有可能是 flick，所以放在 flick 判断的后面
    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        initX: context.initX,
        initY: context.initY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick
      });
    }
  }

  cancel(point, context) {
    const { clientX, clientY } = point;
    this.dispatcher.dispatch('cancel', {});
    clearTimeout(context.handler);
  }
}


export class Dispatcher {
  constructor(element) {
    this.element = element;
  }

  dispatch(type, properties) {
    const event = new Event(type);
    for (const name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}
