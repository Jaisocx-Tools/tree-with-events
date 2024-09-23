class JSTreeModifiable {
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

    attachEvents() {
        const toggleButtonHandler = (event) => {
            const toggleButton = event.target.closest('.toggle-button');
            if (
                !event.target.classList.contains('toggle-button') && 
                (toggleButton === null)
            ) {
                return;
            }

            event.stopPropagation();
            event.preventDefault();

            if (toggleButton.classList.contains(this.CLASS_WITHOUT_SUBTREE)) {
                return;
            }

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
        };

        const documentBaseEventHandler = (event, handler) => {
            if (this.debug === true) {
                console.log('js tree doc click event handler');
            }

            let currentElement = event.target;
            if (!currentElement.classList.contains('tree-element-label')) {
                if (this.debug === true) {
                    console.log('tree elem clicked: is not a tree elem label', currentElement);
                }
                return;
            }

            event.stopPropagation();
            event.preventDefault();

            while(currentElement) {                
                if (currentElement.classList.contains('tree-element')) {
                    const node = JSON.parse(currentElement.dataset.json);

                    if (this.debug === true) {
                        console.log(`tree elem : ${event.name}`, currentElement, node);
                    }

                    handler(event, node);
                    break;
                }

                currentElement = currentElement.parentElement;
            }
        };

        const contextmenuEventHandler = (event) => {
            let contextMenuContainer = null;
            try{
                contextMenuContainer = document.getElementById(this.CLASS_AND_ID__CONTEXT_MENU);
                contextMenuContainer.innerHTML = '';
            }catch(e){}
            if(!contextMenuContainer) {
                contextMenuContainer = document.createElement('DIV');
                contextMenuContainer.id = this.CLASS_AND_ID__CONTEXT_MENU;
                contextMenuContainer.className = this.CLASS_AND_ID__CONTEXT_MENU;
                contextMenuContainer = document.body.appendChild(contextMenuContainer);
            }

            let labelElem = event.target;
            let currentTreeNodeContainer = labelElem.closest('li');
            let subtreeContainer = currentTreeNodeContainer.getElementsByTagName('ul')[0];

            this.updateContextMenu(event, subtreeContainer, currentTreeNodeContainer, contextMenuContainer, labelElem);
        };

        const documentClickEventHandler = (event) => {
            documentBaseEventHandler(event, this.nodeClickEventHandler);
        };

        const documentContextmenuEventHandler = (event) => {
            documentBaseEventHandler(event, contextmenuEventHandler);
        };

        const closeContextMenuIfBeyoundContextmenuClick = (event) => {
            const isClickBeyoundContextMenu = event.target.closest(this.CLASS_AND_ID__CONTEXT_MENU) === null;
            if (isClickBeyoundContextMenu) {
                const contextMenuContainer = document.getElementById(this.CLASS_AND_ID__CONTEXT_MENU);
                if (contextMenuContainer && contextMenuContainer.style) {
                    contextMenuContainer.style.display = 'none';
                }
            }
        };

        document.addEventListener('click', toggleButtonHandler);

        if (typeof(this.nodeClickEventHandler) === 'function') {
            document.addEventListener('click', documentClickEventHandler);
        }

        document.addEventListener('contextmenu', documentContextmenuEventHandler);
        document.addEventListener('click', closeContextMenuIfBeyoundContextmenuClick);
    }

    updateContextMenu(event, container, li, contextMenuContainer, titleElem) {
        let ulCM = document.createElement('UL');
        ulCM = contextMenuContainer.appendChild(ulCM);

        let liAppend = document.createElement('LI');
        liAppend.innerHTML = 'Append child node';
        liAppend = ulCM.appendChild(liAppend);
        liAppend.onclick = function(){
            contextMenuContainer.style.display = 'none';
            const node = {title: 'new node', href: 'javascript: void(0);', parents: parseInt(li.getAttribute('data-id'))};
            let childElemsContainer = null;
            let lastChildPosition = 0;
            try{
                childElemsContainer = li.getElementsByTagName('UL')[0];
            }catch(e){}
            if(!childElemsContainer){
                childElemsContainer = document.createElement('UL');
                childElemsContainer = li.appendChild(childElemsContainer);
                const toggleButton = li.getElementsByClassName(this.CLASS_NOCHILDREN)[0];
                toggleButton.className = this.CLASS_OPEN;
                const ul = childElemsContainer;
                toggleButton.onclick = function(){
                    if(toggleButton.className === this.CLASS_CLOSED){
                        toggleButton.className = this.CLASS_OPEN;
                        ul.style.display = 'block';
                    }else if(toggleButton.className === this.CLASS_OPEN){
                        toggleButton.className = this.CLASS_CLOSED;
                        ul.style.display = 'none';
                    }
                };
            }else{
                try {
                    lastChildPosition = parseInt(childElemsContainer.lastChild.getAttribute('data-position'));
                }catch(e){}
            }
            node.position = lastChildPosition+1;

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                const newNode = JSON.parse(xhr.responseText);
                const newLi = this.renderOneTreeNode(node, childElemsContainer);
                newLi.setAttribute('data-id', newNode.id);
            };
            xhr.open('POST', this.url);
            xhr.setRequestHeader('Authorization', this.accessToken);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.send(JSON.stringify(node));
        };

        let liEdit = document.createElement('LI');
        liEdit.innerHTML = 'Edit me';
        liEdit = ulCM.appendChild(liEdit);
        liEdit.onclick = function(){
            contextMenuContainer.style.display = 'none';
            this.updateEditModal(this, titleElem, li);
        };

        let liDrop = document.createElement('LI');
        liDrop.innerHTML = 'Drop me';
        liDrop = ulCM.appendChild(liDrop);
        liDrop.onclick = function(){
            contextMenuContainer.style.display = 'none';
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                container.removeChild(li);
            };
            xhr.open('DELETE', this.url + '/' + li.getAttribute('data-id') );
            xhr.setRequestHeader('Authorization', this.accessToken);
            xhr.send(null);
        };

        contextMenuContainer.style.display = 'block';

        const elem = event.target;
        const rect = elem.getBoundingClientRect();

        contextMenuContainer.style.top = parseInt(rect.bottom) + 'px';
        contextMenuContainer.style.left = parseInt(rect.left) + 'px';
    }

    createEditModal() {
        const modalBackground = document.createElement('DIV');
        modalBackground.className = 'modal-background';
        modalBackground.id = 'modal-background';
        modalBackground = document.body.appendChild(modalBackground);

        const modalContainer = document.createElement('DIV');
        modalContainer.className = 'modal-edit-container';
        modalContainer.id = 'modal-edit-container';
        modalContainer = document.body.appendChild(modalContainer);

        const modalCloseBtnContainer = document.createElement('DIV');
        modalCloseBtnContainer.className = 'modal-close-btn';
        modalCloseBtnContainer.id = 'modal-close-btn';
        const modalCloseBtn = document.createElement('SPAN');
        modalCloseBtn.innerHTML = '&times;';
        modalCloseBtn.onclick = function(){
            modalBackground.style.display = 'none';
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'visible';
        };
        modalCloseBtnContainer = modalContainer.appendChild(modalCloseBtnContainer);
        modalCloseBtn = modalCloseBtnContainer.appendChild(modalCloseBtn);


        const modalContent = document.createElement('DIV');
        modalContent.className = 'modal-edit-content';
        modalContent.innerHTML =
            '<div><label for="node-edit-title">Title</label><input id="node-edit-title" type="text" value="" /></div>' +
            '<div><label for="node-edit-href">HREF</label><input id="node-edit-href" type="text" value="" /></div>' +
            '<div><button id="node-update-button">Ok</button></div>';
        modalContent = modalContainer.appendChild(modalContent);
    }

    updateEditModal(titleElem, li) {
        const modalBackground = null;
        const modalContainer = null;
        const modalCloseBtn = null;
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

        const updateBtn = document.getElementById('node-update-button');
        updateBtn.adEventListener('click', (event) => {

            const title = document.getElementById('node-edit-title').value;
            const href = document.getElementById('node-edit-href').value;

            modalCloseBtn.click();

            const xhr = new XMLHttpRequest();
            const node = {
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
            xhr.open('PATCH', this.url + '/' + li.getAttribute('data-id'));
            xhr.setRequestHeader('Authorization', this.accessToken);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(node));
        });
    }
}