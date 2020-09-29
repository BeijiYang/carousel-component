import { Timeline, Animation } from './animation';

const timeline = new Timeline();

timeline.start();
timeline.add(new Animation(
  document.querySelector('.block').style,
  // { set a(v) { console.log(v) } },
  // 'a',
  'transform',
  0,
  500,
  2000,
  0,
  null,
  val => `translateX(${val}px)`,
));

document.querySelector('.pause-btn').addEventListener('click', timeline.pause.bind(timeline));
document.querySelector('.resume-btn').addEventListener('click', timeline.resume.bind(timeline));