"use strict";

class JSTree
{
    constructor() {
        this.url = '';
        this.elementId = '';

        this.CLASS_OPENED = 'toggle-with-subtree-opened';
        this.CLASS_CLOSED = 'toggle-with-subtree-closed';
        this.CLASS_WITHOUT_SUBTREE = 'toggle-without-subtree';
    }

    load(){
        if(!this.url || !this.elementId){
            return;
        }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
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

        const li = document.createElement('LI');
        let treeElement = document.createElement('SPAN');
        treeElement.innerHTML = `<span class="toggle-button">
            <span class="opened"></span>
            <span class="closed"></span>
            <span class="without-subtree"></span>
            <span class="animated"></span>
        </span>
        
        <a href="${href}" class="title">${title}</a>
        `;

        treeElement.classList.add('tree-element');

        li.append(treeElement);
        const toggleButton = treeElement.childNodes.item(0);
        container.append(li);

        const nodes = node.subtree;
        if(!nodes){
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

        const count = nodes.length;
        let childNode = null;
        for(let i=0; i<count; i++){
            childNode = nodes[i];
            this.renderOneTreeNode(childNode, ul);
        }
    }
}