const element = document.documentElement;
let isListeningMouse = false;

element.addEventListener('mousedown', evt => {
  const context = Object.create(null);
  contexts.set(`mouse${1 << evt.button}`, context);
  start(evt, context);

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
        move(evt, context);
      }
      button = button << 1;
    }
  }

  const mouseup = evt => {
    console.log('end', evt.button)
    const context = contexts.get(`mouse${1 << evt.button}`);
    end(evt, context);
    contexts.delete(`mouse${1 << evt.button}`);

    if (evt.buttons === 0) { // 判断是否还有 key 在，当 buttons 完全空了？等于 0 了。
      element.removeEventListener('mousemove', mousemove);
      element.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }

  }
  if (!isListeningMouse) {
    element.addEventListener('mousemove', mousemove);
    element.addEventListener('mouseup', mouseup);
    isListeningMouse = true;
  }
});

// 触屏
// touch 系列事件与 mouse 系列事件的区别：touch start 触发时，也会触发 move，而且是和 start 在同一个元素上。
// 所以 touch 事件的监听不需要像 mouse 一样，在 mousedown 之后才监听 mousemove
// 鼠标晃动的时候，可以按下键，也可以不按；而 touchmove 无法越过 touchstart 执行。
// 特殊的 touchcancel , touch 事件被系统事件等打断
const contexts = new Map();

element.addEventListener('touchstart', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;

    const context = Object.create(null);
    contexts.set(touch.identifier, context);
    start(touch, context);
  }
})
element.addEventListener('touchmove', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    const context = contexts.get(touch.identifier);
    move(touch, context);
  }
})
element.addEventListener('touchend', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    const context = contexts.get(touch.identifier);
    end(touch, context);
    contexts.delete(touch.identifier); // end() 之后
  }
})
element.addEventListener('touchcancel', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    const context = contexts.get(touch.identifier);
    cancel(touch);
    contexts.delete(touch.identifier);
  }
})

/**
 * start 时关心三件事：
 * 1.是否 end；
 * 2.是否移动了10px，形成 pan；
 * 3.是否过了0.5s，形成 press；
 */
// let handler = null;
// let isPan = false;
// let initX, initY;
// let isTap = true;
// let isPress = false;

const start = (point, context) => {
  const { clientX, clientY } = point;
  context.initX = clientX;
  context.initY = clientY;

  context.isTap = true; // 默认是点击
  context.isPan = false;
  context.isPress = false;

  context.handler = setTimeout(() => { // 判断是否是长按
    console.log('press');
    context.isPress = true;
    context.isTap = false;
    context.isPan = false;
    context.handler = null;
  }, 500);
}
const move = (point, context) => {
  const { clientX, clientY } = point;
  const movedX = clientX - context.initX;
  const movedY = clientY - context.initY;

  // 判断是否是拖动（移动距离大于 10 px）
  if (!context.isPan && (movedX ** 2 + movedY ** 2 > 100)) {
    context.isPan = true;
    context.isTap = false;
    context.isPress = false;
    console.log('pan start');
    clearTimeout(context.handler);
  }

  if (context.isPan) {
    console.log(movedX, movedY);
    console.log('isPan')
  }

  // console.log('move', clientX, clientY)
}
const end = (point, context) => {
  const { clientX, clientY } = point;
  if (context.isTap) {
    console.log('tap');
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('pan end');
  }
  if (context.isPress) {
    console.log('press end');
  }
}
const cancel = (point, context) => {
  const { clientX, clientY } = point;
  console.log('cancel', clientX, clientY)
  clearTimeout(context.handler);
}



