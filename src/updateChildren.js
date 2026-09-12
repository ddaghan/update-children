const allEvents = Object.keys(document.__proto__.__proto__).filter(s => s.startsWith('on'));

export function updateChildren(node, newChildNodes = []) {
    let remainingOldNodes = node.childNodes.length;
    let remainingNewNodes = newChildNodes.length;
    let oldNodeIndex = 0;
    let newNodeIndex = 0;
    // newChildNodes is an array or nodeList. When we insert an item from it, array does not change but nodeList loses that element.
    // We must increment newNodeIndex for array, but not for nodeList in case of insertions or replaces.
    const isNewNodesArray = Array.isArray(newChildNodes);
    for (;;) {
        if (remainingOldNodes === 0 && remainingNewNodes === 0) {
            break;
        }
        if (remainingOldNodes === 0) {
            const frag = document.createDocumentFragment();
            for (let i = newNodeIndex; i < newChildNodes.length; ) {
                frag.appendChild(newChildNodes[i]);
                if (isNewNodesArray) {
                    ++i;
                }
            }
            node.appendChild(frag);
            break;
        }
        if (remainingNewNodes === 0) {
            while (remainingOldNodes--) {
                node.removeChild(node.lastChild);
            }
            break;
        }
        const oldChildNode = node.childNodes[oldNodeIndex];
        const newChildNode = newChildNodes[newNodeIndex];
        
        const isOldChildNodeText = oldChildNode.nodeType === 3;
        const isNewChildNodeText = newChildNode.nodeType === 3;

        if (isOldChildNodeText && isNewChildNodeText) {
            let isReplaced = false;
            if (oldChildNode.textContent  !== newChildNode.textContent) {                
                oldChildNode.replaceWith(newChildNode);
                isReplaced = true;
            }
            ++oldNodeIndex;
            if (isNewNodesArray && isReplaced) {
                ++newNodeIndex;
            }
            --remainingOldNodes;
            --remainingNewNodes;
            continue;
        }

        if (isOldChildNodeText != isNewChildNodeText ||
            oldChildNode.tagName !== newChildNode.tagName) {
             if (remainingOldNodes > remainingNewNodes) {
                oldChildNode.remove();
                --remainingOldNodes;
                continue;
            } else if (remainingNewNodes > remainingOldNodes) {                
                oldChildNode.before(newChildNode);
                ++oldNodeIndex;
                if (isNewNodesArray) {
                    ++newNodeIndex;
                }
                --remainingNewNodes;
                continue;
            } else {
                oldChildNode.replaceWith(newChildNode);
                ++oldNodeIndex;
                if (isNewNodesArray) {
                    ++newNodeIndex;
                }
                --remainingOldNodes;
                --remainingNewNodes;
                continue;
            }
        }

        // textContent heuristic:
        if (oldChildNode.textContent !== newChildNode.textContent && remainingOldNodes !== remainingNewNodes) {
            if (remainingOldNodes > remainingNewNodes) {
                oldChildNode.remove();
                --remainingOldNodes;
                continue;
            } else if (remainingNewNodes > remainingOldNodes) {
                oldChildNode.before(newChildNode);
                ++oldNodeIndex;
                if (isNewNodesArray) {
                    ++newNodeIndex;
                }
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
                    continue;
                }
            } else {
                oldChildNode.removeAttribute(oldAttrName);
            }
        }
        for (const newAttr of newAttributes) {
            const newAttrName = newAttr.name;
            const newAttrValue = newAttr.value;
            if (!oldAttributes[newAttrName]) {
                oldChildNode.setAttribute(newAttrName, newAttrValue);
            }
        }

        allEvents.forEach(eventName => {
            const oldEventHandler = oldChildNode[eventName] || '';
            const newEventHandler = newChildNode[eventName] || '';
            if (oldEventHandler !== newEventHandler && oldEventHandler.toString() !== newEventHandler.toString()) {
                oldChildNode[eventName] = newEventHandler;
            }
        });
        updateChildren(oldChildNode, newChildNode.childNodes);
        ++oldNodeIndex;
        ++newNodeIndex;
        --remainingOldNodes;
        --remainingNewNodes;
    }
}