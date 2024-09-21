function TreeEditable(){
    this.TYPE_XML = 1;
    this.TYPE_JSON = 2;

    this.src = '';
    this.elementId = '';
    this.type = this.TYPE_JSON;
    this.accessToken = '';

    this.CLASS_OPEN = 'toggle-with-children-opened far fa-arrow-alt-circle-down';
    this.CLASS_CLOSED = 'toggle-with-children-closed far fa-arrow-alt-circle-right';
    this.CLASS_NOCHILDREN = 'toggle-without-subtree far fa-circle';

    this.load = function(){
        if(!this.src || !this.elementId){
            return;
        }
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            var jsonNodes = JSON.parse(xhr.responseText);
            self.drawFromJSON(jsonNodes.entities);
        };
        xhr.open('GET', this.src + '?expand=children&parentId=0', true);
        xhr.setRequestHeader('Authorization', this.accessToken);
        xhr.send();
    };
    this.drawFromJSON = function(json){
        var container = document.getElementById(this.elementId);
        container.className = 'tree';
        var ul = document.createElement('UL');
        ul = container.appendChild(ul);
        var nodes = json;
        var i=0;
        var count = nodes.length;
        var node = null;
        for(i=0; i<count; i++){
            node = nodes[i];
            this.drawSingleNodeFromJSON(node, ul);
        }
    };
    this.drawSingleNodeFromJSON = function(node, container){
        var title = node.title;
        var li = document.createElement('LI');
        li.setAttribute('data-id', node.id);
        li.setAttribute('data-parentid', node.parentId);
        li.setAttribute('data-position', node.position);

        var switchButton = document.createElement('SPAN');

        var titleElem = document.createElement('A');
        if(node.href){
            titleElem.href = node.href;
        }else {
            titleElem.href = 'javascript: void(0);';
        }
        titleElem.innerHTML = title;
        titleElem.className = 'title';

        switchButton = li.appendChild(switchButton);
        titleElem = li.appendChild(titleElem);

        container.appendChild(li);

        var self = this;

        switchButton.oncontextmenu = function(evt) {
            evt.preventDefault();
        };

        titleElem.oncontextmenu = function(evt){
            evt.preventDefault();
            var contextMenuContainer = null;
            try{
                contextMenuContainer = document.getElementById('context-menu-container');
                contextMenuContainer.innerHTML = '';
            }catch(e){}
            if(!contextMenuContainer) {
                contextMenuContainer = document.createElement('DIV');
                contextMenuContainer.id = 'context-menu-container';
                contextMenuContainer.className = 'context-menu-container';
                contextMenuContainer = document.body.appendChild(contextMenuContainer);
            }
            self.updateContextMenu(evt, container, li, contextMenuContainer, self, titleElem);
            document.onclick = function(){
                contextMenuContainer.style.display = 'none';
            };
        };

        var nodes = null;
        var childrenCount = 0;
        try{
            nodes = node.children;
            childrenCount = nodes.length;
        }catch(e){}
        if(childrenCount){
            var ul = document.createElement('UL');
            ul = li.appendChild(ul);

            if(node.opened === true){
                switchButton.className = this.CLASS_OPEN;
                ul.style.display = 'block';
            }else{
                switchButton.className = this.CLASS_CLOSED;
                ul.style.display = 'none';
            }
            switchButton.onclick = function(){
                if(switchButton.className === self.CLASS_CLOSED){
                    switchButton.className = self.CLASS_OPEN;
                    ul.style.display = 'block';
                }else if(switchButton.className === self.CLASS_OPEN){
                    switchButton.className = self.CLASS_CLOSED;
                    ul.style.display = 'none';
                }
            };
            var i=0;
            var count = nodes.length;
            var node = null;
            for(i=0; i<count; i++){
                node = nodes[i];
                this.drawSingleNodeFromJSON(node, ul);
            }
        }else{
            switchButton.className = this.CLASS_NOCHILDREN;
        }
        return li;
    };

    this.updateContextMenu = function(evt, container, li, contextMenuContainer, self, titleElem){

        var ulCM = document.createElement('UL');
        ulCM = contextMenuContainer.appendChild(ulCM);

        var liAppend = document.createElement('LI');
        liAppend.innerHTML = 'Append child node';
        liAppend = ulCM.appendChild(liAppend);
        liAppend.onclick = function(){
            contextMenuContainer.style.display = 'none';
            var node = {title: 'new node', href: 'javascript: void(0);', parents: parseInt(li.getAttribute('data-id'))};
            var childElemsContainer = null;
            var lastChildPosition = 0;
            try{
                childElemsContainer = li.getElementsByTagName('UL')[0];
            }catch(e){}
            if(!childElemsContainer){
                childElemsContainer = document.createElement('UL');
                childElemsContainer = li.appendChild(childElemsContainer);
                var switchButton = li.getElementsByClassName(self.CLASS_NOCHILDREN)[0];
                switchButton.className = self.CLASS_OPEN;
                var ul = childElemsContainer;
                switchButton.onclick = function(){
                    if(switchButton.className === self.CLASS_CLOSED){
                        switchButton.className = self.CLASS_OPEN;
                        ul.style.display = 'block';
                    }else if(switchButton.className === self.CLASS_OPEN){
                        switchButton.className = self.CLASS_CLOSED;
                        ul.style.display = 'none';
                    }
                };
            }else{
                try {
                    lastChildPosition = parseInt(childElemsContainer.lastChild.getAttribute('data-position'));
                }catch(e){}
            }
            node.position = lastChildPosition+1;

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                var newNode = JSON.parse(xhr.responseText);
                var newLi = self.drawSingleNodeFromJSON(node, childElemsContainer);
                newLi.setAttribute('data-id', newNode.id);
            };
            xhr.open('POST', self.src);
            xhr.setRequestHeader('Authorization', self.accessToken);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.send(JSON.stringify(node));
        };

        var liEdit = document.createElement('LI');
        liEdit.innerHTML = 'Edit me';
        liEdit = ulCM.appendChild(liEdit);
        liEdit.onclick = function(){
            contextMenuContainer.style.display = 'none';
            self.updateEditModal(self, titleElem, li);
        };

        var liDrop = document.createElement('LI');
        liDrop.innerHTML = 'Drop me';
        liDrop = ulCM.appendChild(liDrop);
        liDrop.onclick = function(){
            contextMenuContainer.style.display = 'none';
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                container.removeChild(li);
            };
            xhr.open('DELETE', self.src + '/' + li.getAttribute('data-id') );
            xhr.setRequestHeader('Authorization', self.accessToken);
            xhr.send(null);
        };

        contextMenuContainer.style.display = 'block';

        var elem = evt.target;
        var rect = elem.getBoundingClientRect();

        contextMenuContainer.style.top = parseInt(rect.bottom) + 'px';
        contextMenuContainer.style.left = parseInt(rect.left) + 'px';
    };

    this.createEditModal = function(){
        var modalBackground = document.createElement('DIV');
        modalBackground.className = 'modal-background';
        modalBackground.id = 'modal-background';
        modalBackground = document.body.appendChild(modalBackground);

        var modalContainer = document.createElement('DIV');
        modalContainer.className = 'modal-edit-container';
        modalContainer.id = 'modal-edit-container';
        modalContainer = document.body.appendChild(modalContainer);

        var modalCloseBtnContainer = document.createElement('DIV');
        modalCloseBtnContainer.className = 'modal-close-btn';
        modalCloseBtnContainer.id = 'modal-close-btn';
        var modalCloseBtn = document.createElement('SPAN');
        modalCloseBtn.innerHTML = '&times;';
        modalCloseBtn.onclick = function(){
            modalBackground.style.display = 'none';
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'visible';
        };
        modalCloseBtnContainer = modalContainer.appendChild(modalCloseBtnContainer);
        modalCloseBtn = modalCloseBtnContainer.appendChild(modalCloseBtn);


        var modalContent = document.createElement('DIV');
        modalContent.className = 'modal-edit-content';
        modalContent.innerHTML =
            '<div><label for="node-edit-title">Title</label><input id="node-edit-title" type="text" value="" /></div>' +
            '<div><label for="node-edit-href">HREF</label><input id="node-edit-href" type="text" value="" /></div>' +
            '<div><button id="node-update-button">Ok</button></div>';
        modalContent = modalContainer.appendChild(modalContent);
    };

    this.updateEditModal = function(self, titleElem, li){
        var modalBackground = null;
        var modalContainer = null;
        var modalCloseBtn = null;
        try{
            modalBackground = document.getElementById('modal-background');
        }catch(e){}
        if(!modalBackground){
            this.createEditModal();
        }

        modalBackground = document.getElementById('modal-background');
        modalContainer = document.getElementById('modal-edit-container');
        modalCloseBtn = document.getElementById('modal-close-btn').getElementsByTagName('SPAN')[0];
        modalBackground.style.display = 'block';
        modalContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';

        document.getElementById('node-edit-title').value = titleElem.innerHTML;
        document.getElementById('node-edit-href').value = titleElem.href;

        var updateBtn = document.getElementById('node-update-button');
        updateBtn.onclick = function(){

            var title = document.getElementById('node-edit-title').value;
            var href = document.getElementById('node-edit-href').value;

            modalCloseBtn.click();

            var xhr = new XMLHttpRequest();
            var node = {
            'title': title,
            'href': href,
            'parents': li.getAttribute('data-parentid'),
            'position': li.getAttribute('data-position')
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;

                titleElem.innerHTML = title;
                titleElem.href = href;
            };
            xhr.open('PATCH', self.src + '/' + li.getAttribute('data-id'));
            xhr.setRequestHeader('Authorization', self.accessToken);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(node));
        };
    };
}