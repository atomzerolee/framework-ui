function createElement(tag, attrs, ...children) {
  return {
      tag,
      attrs,
      children
  }
}

const React = {
  createElement
}

const element = (
  <div>
    hello<span>world!</span>
  </div>
);
console.log( element );