const element = document.documentElement;

element.addEventListener('mousedown', evt => {
  start(evt);
  const mousemove = evt => {
    move(evt);
    // console.log(evt.clientX, evt.clientY);
  }

  const mouseup = evt => {
    end(evt);
    element.removeEventListener('mousemove', mousemove);
    element.removeEventListener('mouseup', mouseup);
  }

  element.addEventListener('mousemove', mousemove);
  element.addEventListener('mouseup', mouseup);
});

// 触屏
// touch 系列事件与 mouse 系列事件的区别：touch start 触发时，也会触发 move，而且是和 start 在同一个元素上。
// 所以 touch 事件的监听不需要像 mouse 一样，在 mousedown 之后才监听 mousemove
// 鼠标晃动的时候，可以按下键，也可以不按；而 touchmove 无法越过 touchstart 执行。
// 特殊的 touchcancel , touch 事件被系统事件等打断
element.addEventListener('touchstart', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    // console.log(1, clientX, clientY);
    start(touch);
  }
})
element.addEventListener('touchmove', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    // console.log(2, clientX, clientY);
    move(touch);
  }
})
element.addEventListener('touchend', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    // console.log(3, clientX, clientY);
    end(touch);
  }
})
element.addEventListener('touchcancel', evt => {
  for (const touch of evt.changedTouches) {
    const { clientX, clientY } = touch;
    // console.log(4, clientX, clientY);
    cancel(touch);
  }
})

/**
 * start 时关心三件事：
 * 1.是否 end；
 * 2.是否移动了10px，形成 pan；
 * 3.是否过了0.5s，形成 press；
 */
let handler = null;
let isPan = false;
let initX, initY;
let isTap = true;
let isPress = false;

const start = (point) => {
  const { clientX, clientY } = point;
  initX = clientX;
  initY = clientY;

  isTap = true; // 默认是点击
  isPan = false;
  isPress = false;

  handler = setTimeout(() => { // 判断是否是长按
    console.log('press');
    isPress = true;
    isTap = false;
    isPan = false;
    handler = null;
  }, 500);
}
const move = (point) => {
  const { clientX, clientY } = point;
  const movedX = clientX - initX;
  const movedY = clientY - initY;

  // 判断是否是拖动（移动距离大于 10 px）
  if (!isPan && (movedX ** 2 + movedY ** 2 > 100)) {
    isPan = true;
    isTap = false;
    isPress = false;
    console.log('pan start');
    clearTimeout(handler);
  }

  if (isPan) {
    console.log(movedX, movedY);
    console.log('isPan')
  }

  // console.log('move', clientX, clientY)
}
const end = (point) => {
  const { clientX, clientY } = point;
  if (isTap) {
    console.log('tap');
    clearTimeout(handler);
  }
  if (isPan) {
    console.log('pan end');
  }
  if (isPress) {
    console.log('press end');
  }
}
const cancel = (point) => {
  const { clientX, clientY } = point;
  console.log('cancel', clientX, clientY)
  clearTimeout(handler);
}