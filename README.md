# A very small (155 bytes) uuidv7 generator

## Install

```
npm install update-children
```

## Use

```js
import {updateChildren} from 'update-children'

const container = document.createElement('div')

const childSpan = document.createElement('span');
childSpan.appendChild(document.createTextNode('hello'));
const childButton = document.createElement('button')
childButton.appendChild(document.createTextNode('click me'));
childButton.onclick = () => alert(1)
container.appendChild(childSpan);
container.appendChild(childButton);

const newChildSpan = document.createElement('span');
newChildSpan.appendChild(document.createTextNode('hi'));
const newChildButton = document.createElement('button');
newChildButton.appendChild(document.createTextNode('click me'));
newChildButton.onclick = () => alert(2);

updateChildren(container, [
    newChildSpan, // It does not replace the span, only updates the text content
    newChildButton, // It does not replace the button, and keeps the text content. Only updates onclick
]);

const newNewChildButton = document.createElement('button');
newNewChildButton.appendChild(document.createTextNode('click me'));
newNewChildButton.onclick = () => alert(2);

updateChildren(container, [
    // removes the span
    newNewChildButton, // does not change anything
]);
```
