"use strict";

class JSTree
{
    constructor() {
        this.elementId = '';
        this.url = '';
        this.nodeClickEventHandler = null;
        this.debug = false;

        this.CLASS_OPENED = 'toggle-with-subtree-opened';
        this.CLASS_CLOSED = 'toggle-with-subtree-closed';
        this.CLASS_WITHOUT_SUBTREE = 'toggle-without-subtree';
    }

    setUrl(url) {
        this.url = url;
        return this;
    }
    setElementId(elementId) {
        this.elementId = elementId;
        return this;
    }
    setNodeClickEventHandler(nodeClickEventHandler) {
        this.nodeClickEventHandler = nodeClickEventHandler;
        return this;
    }
    setDebug(toDebug) {
        this.debug = toDebug;
        return this;
    }

    load(){
        if(!this.url || !this.elementId){
            return;
        }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
                this.attachEvents();
            });
    }

    render(nodes){
        const container = document.getElementById(this.elementId);
        container.className = 'tree';
        let ul = document.createElement('UL');
        container.append(ul);
        const count = nodes.length;
        let node = null;
        for(let i=0; i<count; i++){
            node = nodes[i];
            this.renderOneTreeNode(node, ul);
        }
    }

    renderOneTreeNode(node, container){
        const title = node.title;
        const href = node.href ?? 'javascript: void(0);';
        const subtreeNodes = node.subtree;
        const hasSubtree = !!subtreeNodes;
        const nodeClone = {...node};
        delete(nodeClone.subtree);
        nodeClone.hasSubtree = hasSubtree;
        const jsonString = JSON.stringify(nodeClone);

        const li = document.createElement('LI');
        let treeElement = document.createElement('SPAN');
        treeElement.innerHTML = `<span class="toggle-button">
            <span class="opened"></span>
            <span class="closed"></span>
            <span class="without-subtree"></span>
            <span class="animated"></span>
        </span>

        <a href="${href}" class="tree-element-label">${title}</a>
        `;

        treeElement.classList.add('tree-element');
        treeElement.dataset.json = jsonString;

        li.append(treeElement);
        const toggleButton = treeElement.childNodes.item(0);
        container.append(li);

        if(!hasSubtree){
            toggleButton.classList.add(this.CLASS_WITHOUT_SUBTREE);
            return;
        }

        let ul = document.createElement('UL');
        li.append(ul);

        if(node.opened === true){
            toggleButton.classList.add(this.CLASS_OPENED);
            ul.style.display = 'block';
        }else{
            toggleButton.classList.add(this.CLASS_CLOSED);
            ul.style.display = 'none';
        }
        const self = this;
        toggleButton.addEventListener('click', () => {
            if(toggleButton.classList.contains(this.CLASS_CLOSED)) {
                toggleButton.classList.remove(this.CLASS_CLOSED);
                toggleButton.classList.add(this.CLASS_OPENED);
                ul.style.display = 'block';
            }else if(toggleButton.classList.contains(this.CLASS_OPENED)) {
                toggleButton.classList.remove(this.CLASS_OPENED);
                toggleButton.classList.add(this.CLASS_CLOSED);
                ul.style.display = 'none';
            }
        });

        const count = subtreeNodes.length;
        let childNode = null;
        for(let i=0; i<count; i++){
            childNode = subtreeNodes[i];
            this.renderOneTreeNode(childNode, ul);
        }
    }

    attachEvents() {
        const documentClickEventHandler = (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (this.debug === true) {
                console.log('js tree doc click event handler');
            }

            if (typeof(this.nodeClickEventHandler) !== 'function') {
                if (this.debug === true) {
                    console.log('tree elem clicked: handler is not a function');
                }

                document.removeEventListener('click', documentClickEventHandler);

                return;
            }

            let currentElement = event.target;
            if (!currentElement.classList.contains('tree-element-label')) {
                if (this.debug === true) {
                    console.log('tree elem clicked: is not a tree elem label', currentElement);
                }
                return;
            }

            while(currentElement) {                
                if (currentElement.classList.contains('tree-element')) {
                    const node = JSON.parse(currentElement.dataset.json);

                    if (this.debug === true) {
                        console.log('tree elem clicked:', currentElement, node);
                    }

                    this.nodeClickEventHandler(
                        node
                    );
                    break;
                }

                currentElement = currentElement.parentElement;
            }
        };

        document.addEventListener('click', documentClickEventHandler);
    }
}

