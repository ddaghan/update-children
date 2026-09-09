const allEvents = ["onabort","onanimationcancel","onanimationend","onanimationiteration","onanimationstart","onauxclick",
    "onbeforecopy","onbeforecut","onbeforeinput","onbeforematch","onbeforepaste","onbeforetoggle","onbeforexrselect",
    "onblur","oncancel","oncanplay","oncanplaythrough","onchange","onclick","onclose","oncommand",
    "oncontentvisibilityautostatechange","oncontextlost","oncontextmenu","oncontextrestored","oncopy","oncuechange",
    "oncut","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop",
    "ondurationchange","onemptied","onended","onerror","onfocus","onformdata","onfullscreenchange","onfullscreenerror",
    "ongotpointercapture","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata",
    "onloadedmetadata","onloadstart","onlostpointercapture","onmousedown","onmouseenter","undefined","onmouseleave",
    "undefined","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onpaste","onpause","onplay",
    "onplaying","onpointercancel","onpointerdown","onpointerenter","onpointerleave","onpointermove","onpointerout",
    "onpointerover","onpointerrawupdate","onpointerup","onprogress","onratechange","onreset","onresize","onscroll",
    "onscrollend","onscrollsnapchange","onscrollsnapchanging","onsearch","onsecuritypolicyviolation","onseeked",
    "onseeking","onselect","onselectionchange","onselectstart","onslotchange","onstalled","onsubmit","onsuspend",
    "ontimeupdate","ontoggle","ontransitioncancel","ontransitionend","ontransitionrun","ontransitionstart",
    "onvolumechange","onwaiting","onwebkitanimationend","onwebkitanimationiteration","onwebkitanimationstart",
    "onwebkitfullscreenchange","onwebkitfullscreenerror","onwebkittransitionend","onwheel"];


// TODO: record last opened list, open with it if exists, otherwise create new.
export function updateChildren(node, newChildNodes = []) {
    //console.log('update children called for node:',node, 'newChildNodes', newChildNodes);
    let remainingOldNodes = node.childNodes.length;
    let remainingNewNodes = newChildNodes.length;
    let oldNodeIndex = 0;
    let newNodeIndex = 0;
    for (;;) {
        if (remainingOldNodes === 0 && remainingNewNodes === 0) {
            break;
        }
        //console.log('updating children', 'node', node, 'oldNodeIndex', oldNodeIndex, 'newNodeIndex', newNodeIndex, 'remainingOldNodes', remainingOldNodes, 'remainingNewNodes', remainingNewNodes );
        if (remainingOldNodes === 0) {
            const frag = document.createDocumentFragment();
            for (let i = newNodeIndex; i < newChildNodes.length; ++i) {                
                frag.appendChild(newChildNodes[i]);
                //console.log('within node', node, 'appended', newChildNodes[i]);
            }
            node.appendChild(frag);
            break;
        }
        if (remainingNewNodes === 0) {
            while (remainingOldNodes--) {
                //console.log('within node', node, 'removing', node.lastChild);
                node.removeChild(node.lastChild);
            }
            break;
        }
        const oldChildNode = node.childNodes[oldNodeIndex];
        const newChildNode = newChildNodes[newNodeIndex];
        
        const isOldChildNodeText = oldChildNode.nodeType === 3;
        const isNewChildNodeText = newChildNode.nodeType === 3;

        if (isOldChildNodeText && isNewChildNodeText) {
            if (oldChildNode.textContent  !== newChildNode.textContent) {                
                oldChildNode.replaceWith(newChildNode);
                //console.log('within node', node, 'replaced text node', oldChildNode, 'with', newChildNode);
            }
            ++oldNodeIndex;
            ++newNodeIndex;
            --remainingOldNodes;
            --remainingNewNodes;
            continue;
        }

        if (isOldChildNodeText != isNewChildNodeText ||
            oldChildNode.tagName !== newChildNode.tagName) {
             if (remainingOldNodes > remainingNewNodes) {
                oldChildNode.remove();
                //console.log('within node', node, 'removed', oldChildNode.textContent, oldChildNode);
                ++oldNodeIndex;
                --remainingOldNodes;
                continue;
            } else if (remainingNewNodes > remainingOldNodes) {                
                oldChildNode.after(newChildNode);
                //console.log('within node', node, 'added', newChildNode.textcontent, newChildNode);
                ++newNodeIndex;
                --remainingNewNodes;
                continue;
            } else {
                oldChildNode.replaceWith(newChildNode);
                //console.log('within node', node, 'replaced', oldChildNode.textContent, oldChildNode, 'with', newChildNode.textContent, newChildNode);
                ++oldNodeIndex;
                ++newNodeIndex;
                --remainingOldNodes;
                --remainingNewNodes;
                continue;
            }
        }

        // textContent heuristic:
        if (oldChildNode.textContent !== newChildNode.textContent && remainingOldNodes !== remainingNewNodes) {
            //  console.log('within node', node, 'text content heuristic', 
            //     'oldChildNode.textContent', oldChildNode.textContent,
            //     'newChildNode.textContent', newChildNode.textContent,
            //     'remainingOldNodes', remainingOldNodes,
            //     'remainingNewNodes', remainingNewNodes);
            if (remainingOldNodes > remainingNewNodes) {
                oldChildNode.remove();
                //console.log('textContent heuristic: within node', node, 'removed', oldChildNode.textContent, oldChildNode);
                --remainingOldNodes;
                continue;
            } else if (remainingNewNodes > remainingOldNodes) {
                oldChildNode.before(newChildNode);
                //console.log('textContent heuristic: within node', node, 'added', newChildNode.textContent, newChildNode);
                ++oldNodeIndex;
                ++newNodeIndex;
                --remainingNewNodes;
                continue;
            } else {
                console.error('Error: remainingOldNodes and remainingNewNodes should be different:', remainingOldNodes, remainingNewNodes);
            }
        }

        const oldAttributes = oldChildNode.attributes;
        const newAttributes = newChildNode.attributes;
        for (const oldAttr of oldAttributes) {
            const oldAttrName = oldAttr.name;
            const oldAttrValue = oldAttr.value;
            if (newAttributes[oldAttrName]) {
                const newAttrValue = newAttributes[oldAttrName].value;
                if (newAttrValue != oldAttrValue) {
                    oldChildNode.setAttribute(oldAttrName, newAttrValue);
                    //console.log('node', node, 'child node', oldChildNode, 'updated attribute', oldAttrName, 'to', newAttrValue);
                    continue;
                }
            } else {
                oldChildNode.removeAttribute(oldAttrName);
                //console.log('node', node, 'child node', oldChildNode, 'removed attribute', oldAttrName);
            }
        }
        for (const newAttr of newAttributes) {
            const newAttrName = newAttr.name;
            const newAttrValue = newAttr.value;
            if (!oldAttributes[newAttrName]) {
                //console.log('adding attribute', newAttrName, newAttrValue);
                oldChildNode.setAttribute(newAttrName, newAttrValue);
                //console.log('node', node, 'child node', oldChildNode, 'added attribute', newAttrName, 'as', newAttrValue);
            }
        }

        allEvents.forEach(eventName => {
            const oldEventHandler = oldChildNode[eventName] || '';
            const newEventHandler = newChildNode[eventName] || '';
            if (oldEventHandler !== newEventHandler && oldEventHandler.toString() !== newEventHandler.toString()) {
                if (oldEventHandler.toString()) {
                    //console.log('oldEventHandler.toString()', oldEventHandler.toString());
                }
                if (newEventHandler.toString()) {
                    //console.log('newEventHandler.toString()', newEventHandler.toString());
                }
                oldChildNode[eventName] = newEventHandler;
                //console.log('node', node, 'child node', oldChildNode, 'added/updated event handler for', eventName, 'with', newEventHandler);
            }
        });
        // console.log('node', node, 'checked attributes of', oldChildNode);
        updateChildren(oldChildNode, newChildNode.childNodes);
        ++oldNodeIndex;
        ++newNodeIndex;
        --remainingOldNodes;
        --remainingNewNodes;
    }
}