# An intelligent alternative to Element.replaceChildren()

```updateChildren()``` method does not replace child nodes if they did not change (i.e. reconciliation).

This keeps the focus, and does minimum DOM updates.

## Install

```
npm install update-children
```

## Use

```js
import {updateChildren} from 'update-children'

const container = document.createElement('div')

// Create and append child components
const childSpan = document.createElement('span');
childSpan.appendChild(document.createTextNode('hello'));
const childButton = document.createElement('button')
childButton.appendChild(document.createTextNode('click me'));
childButton.onclick = () => alert(1)
container.appendChild(childSpan);
container.appendChild(childButton);

// Create new child components
const newChildSpan = document.createElement('span');
newChildSpan.appendChild(document.createTextNode('hi'));
const newChildButton = document.createElement('button');
newChildButton.appendChild(document.createTextNode('click me'));
newChildButton.onclick = () => alert(2);

// Update children with our method
// Unlike the native replaceChildren, it does not replace unchanged DOM elements
updateChildren(container, [
    newChildSpan, // It does not replace the span, only updates the text content
    newChildButton, // It does not replace the button, and keeps the text content. Only updates onclick
]);

// Update children with our method again
// It only updates DOM elements and attributes when necessary.
const newNewChildButton = document.createElement('button');
newNewChildButton.appendChild(document.createTextNode('click me'));
newNewChildButton.onclick = () => alert(2);

updateChildren(container, [
    // removes the span
    newNewChildButton, // does not change anything
]);
```
