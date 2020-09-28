import { Component, createElement } from './framework';
import { Carousel } from './carousel';
import { Timeline, Animation } from './animation';

const ids = ['1043', '1044', '996', '220'];
const urlOf = id => `https://picsum.photos/id/${id}/500/300`;

const a = <Carousel src={ids.map(urlOf)} />

a.mountTo(document.body);

const tl = new Timeline();
tl.add(new Animation(
  { set a(v) { console.log(v) } },
  'a',
  0,
  100,
  1000,
  null
))
tl.start();