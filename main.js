function createElement(type, attributes, ...children) {
  const element = typeof type === 'string'
    ? document.createElement(type)
    : new type;

  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }

  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }

  return element;
}



const a = <div id="aa">
  <span>Hey</span>
  ~
</div>

document.body.appendChild(a);


// var a = createElement("div", {
//     id: "aa"
//   },
//   createElement("span", null),
//   createElement("span", null),
//   createElement("span", null)
// );
