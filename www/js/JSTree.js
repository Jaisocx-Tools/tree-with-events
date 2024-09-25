"use strict";

class JSTree
{
    constructor() {
        this.elementId = '';
        this.url = '';
        this.nodeClickEventHandler = null;
        this.debug = false;
        this.accessToken = '';

        this.CLASS_OPENED = 'toggle-with-subtree-opened';
        this.CLASS_CLOSED = 'toggle-with-subtree-closed';
        this.CLASS_WITHOUT_SUBTREE = 'toggle-without-subtree';
        this.CLASS_AND_ID__CONTEXT_MENU = 'context-menu-container';
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
    setAccessToken(token) {
        this.accessToken = token;
    }

    load(){
        if(!this.url || !this.elementId){
            return;
        }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
                this.addEventListeners();
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
        li.setAttribute('data-id', node.id);
        li.setAttribute('data-parentid', node.parentId);
        li.setAttribute('data-position', node.position);

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

        toggleButton.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        });

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

        const count = subtreeNodes.length;
        let childNode = null;
        for(let i=0; i<count; i++){
            childNode = subtreeNodes[i];
            this.renderOneTreeNode(childNode, ul);
        }
    }

    toggleButtonHandler(event) {
        const toggleButton = event.target.closest('.toggle-button');
        if (
            !event.target.classList.contains('toggle-button') && 
            (toggleButton === null)
        ) {
            return;
        }

        if (toggleButton.classList.contains(this.CLASS_WITHOUT_SUBTREE)) {
            return;
        }

        event.preventDefault();

        let subtreeContainer = toggleButton.closest('li').getElementsByTagName('ul')[0];

        if(toggleButton.classList.contains(this.CLASS_CLOSED)) {
            toggleButton.classList.remove(this.CLASS_CLOSED);
            toggleButton.classList.add(this.CLASS_OPENED);
            subtreeContainer.style.display = 'block';
        }else if(toggleButton.classList.contains(this.CLASS_OPENED)) {
            toggleButton.classList.remove(this.CLASS_OPENED);
            toggleButton.classList.add(this.CLASS_CLOSED);
            subtreeContainer.style.display = 'none';
        }
    }

    documentBaseEventHandler(event, handler) {
        if (this.debug === true) {
            console.log('js tree doc click event handler');
        }

        let currentElement = event.target;
        if (!currentElement.classList.contains('tree-element-label')) {
            if (this.debug === true) {
                console.log('tree elem click handler: is not a tree elem label', currentElement);
            }
            return;
        }

        const treeElem = currentElement.closest('.tree-element');
        if (!treeElem) {
            if (this.debug === true) {
                console.log('tree elem click handler: is not a predefined tree elems structure');
            }
            return;
        }

        const node = JSON.parse(treeElem.dataset.json);

        if (this.debug === true) {
            console.log(`tree elem : ${event.name}`, treeElem, node);
        }

        if (node.href && node.href.substring(0, 'javascript:'.length) !== 'javascript:') {
            return;
        }

        event.preventDefault();

        handler(event, node);
    }

    documentClickEventHandler(event) {
        this.documentBaseEventHandler(event, this.nodeClickEventHandler);
    }

    addEventListeners() {
        document.addEventListener('click', this.toggleButtonHandler.bind(this));

        if (typeof(this.nodeClickEventHandler) === 'function') {
            document.addEventListener('click', this.documentClickEventHandler.bind(this));
        }
    }    
}

