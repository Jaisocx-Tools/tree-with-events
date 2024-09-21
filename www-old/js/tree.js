"use strict";

class Tree
{
    constructor(){
        this.TYPE_XML = 1;
        this.TYPE_JSON = 2;

        this.src = '';
        this.elementId = '';
        this.type = this.TYPE_XML;

        this.CLASS_OPEN = 'switch-with-children-open far fa-arrow-alt-circle-down';
        this.CLASS_CLOSED = 'switch-with-children-closed far fa-arrow-alt-circle-right';
        this.CLASS_NOCHILDREN = 'switch-no-children far fa-circle';
    }

    load(){
        if(!this.src || !this.elementId){
            return;
        }
        const xhr = new XMLHttpRequest();
        const self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;

            if(self.type === self.TYPE_XML){
                const jsonNodes = self.getDataFromXML(xhr.responseXML);
                self.drawFromJSON(jsonNodes);
            }else if(self.type === self.TYPE_JSON){
                const jsonNodes = JSON.parse(xhr.responseText);
                self.drawFromJSON(jsonNodes);
            }
        };
        xhr.open('GET', this.src, true);
        xhr.send();
    }

    drawFromJSON(nodes){
        const container = document.getElementById(this.elementId);
        container.className = 'tree';
        let ul = document.createElement('UL');
        container.append(ul);
        const count = nodes.length;
        let node = null;
        for(let i=0; i<count; i++){
            node = nodes[i];
            this.drawSingleNodeFromJSON(node, ul);
        }
    }

    drawSingleNodeFromJSON(node, container){
        const title = node.title;
        const li = document.createElement('LI');

        let switchButton = document.createElement('SPAN');

        const titleElem = document.createElement('A');
        if(node.href){
            titleElem.href = node.href;
        }else {
            titleElem.href = 'javascript: void(0);';
        }
        titleElem.innerHTML = title;
        titleElem.className = 'title';

        li.append(switchButton);
        li.append(titleElem);

        container.append(li);

        const nodes = node.children;
        if(!nodes){
            switchButton.className = this.CLASS_NOCHILDREN;
            return;
        }

        let ul = document.createElement('UL');
        li.append(ul);

        if(node.opened === true){
            switchButton.className = this.CLASS_OPEN;
            ul.style.display = 'block';
        }else{
            switchButton.className = this.CLASS_CLOSED;
            ul.style.display = 'none';
        }
        const self = this;
        switchButton.addEventListener('click', () => {
            if(switchButton.className === self.CLASS_CLOSED){
                switchButton.className = self.CLASS_OPEN;
                ul.style.display = 'block';
            }else if(switchButton.className === self.CLASS_OPEN){
                switchButton.className = self.CLASS_CLOSED;
                ul.style.display = 'none';
            }
        });

        const count = nodes.length;
        let childNode = null;
        for(let i=0; i<count; i++){
            childNode = nodes[i];
            this.drawSingleNodeFromJSON(childNode, ul);
        }
    }

    getDataFromXML(xml){
        let jsonNodes = [];
        const nodes = xml.documentElement.children;
        const count = nodes.length;
        let node = null;
        for(let i=0; i<count; i++){
            node = nodes[i];
            if(node.tagName !== 'node'){continue;}
            jsonNodes.push(this.getDataNodeFromXML(node));
        }
        return jsonNodes;
    }

    getDataNodeFromXML(node){
        let dataElem = {};
        dataElem.title = node.getElementsByTagName('title')[0].childNodes[0].nodeValue;
        if(node.getElementsByTagName('href').length){
            dataElem.href = node.getElementsByTagName('href')[0].childNodes[0].nodeValue;
        }else {
            dataElem.href = 'javascript: void(0);';
        }
        
        let children = node.getElementsByTagName('children');
        if(!children.length){
            return dataElem;
        }

        if(node.getElementsByTagName('opened').length){
            if(node.getElementsByTagName('opened')[0].childNodes[0].nodeValue == 'true'){
                dataElem.opened = true;
            }else{
                dataElem.opened = false;
            }
        }else{
            dataElem.opened = false;
        }
        dataElem.children = [];
        let nodes = node.getElementsByTagName('children')[0].children;
        const count = nodes.length;
        let childNode = null;
        for(let i=0; i<count; i++){
            childNode = nodes[i];
            if(childNode.tagName !== 'node'){
                continue;
            }
            dataElem.children.push(this.getDataNodeFromXML(childNode));
        }

        return dataElem;
    }
}