"use strict";

// JSTree class JavaScript code is a the bottom of this file.

class EventsEmitter {
    constructor() {
        this.eventsHandlersSetThisClass = {};
        this.debug = true;

        this.EventArtJSEvent = 'JSEvent';
    }

    setDebug(toDebug) {
        this.debug = toDebug;
        return this;
    }

    isObjectEmpty(obj) {
        // Check if the object is null or undefined
        if (obj === undefined || obj === null) {
          return true;
        }
      
        // Check if the object is an actual object and not another type
        if (typeof obj !== 'object') {
          return false;
        }
      
        // Check if the object has any own properties
        if (Object.keys(obj).length === 0) {
          return true;
        }
      
        // If all checks pass, the object is not undefined, null, or empty
        return false;
    }
    

    // this method just sets an event handler function by event name to an object, 
    // and then all event handlers are executed on this.emitEvent method call.
    // this.emitEvent method call You can place inside Your js code, 
    // where You wish to provide the interface of optional adding a custom event listener in Your JS class.
    addThisClassEventListener(eventName, eventHandler) {
        if (!this.eventsHandlersSetThisClass[eventName]) {
            this.eventsHandlersSetThisClass[eventName] = [];
        }
        
        this.eventsHandlersSetThisClass[eventName].push(eventHandler);

        return this;
    }

    // this.emitEvent method call You can place inside Your js code, 
    // where You wish to provide the interface of optional adding a custom event listener in Your JS class.
    emitEvent (eventName, payload) {
        const results = [];

        if (this.debug) {
            console.log('event emitted', eventName);
        }
        
        if (this.isObjectEmpty(this.eventsHandlersSetThisClass)) {
          return results;
        }
    
        const eventHandlers = this.eventsHandlersSetThisClass[eventName];
        if (!eventHandlers || eventHandlers.length === 0) {
            if (this.debug) {
                console.log('no event handler for this event', eventName);
            }
            
            return results;
        }

        for (let eventHandler of eventHandlers) {
            if (this.debug) {
                console.log('got event handler', eventName);
            }

            if (!eventHandler || (typeof eventHandler) !== 'function') {
                if (this.debug) {
                    console.log('event handler is not a function', eventName, eventHandler);
                }
                continue;
            }

            if (this.debug) {
                console.log('calling event handler', eventName, eventHandler);
            }

            const result = eventHandler.call(this, payload);
            results.push({eventArt: this.EventArtJSEvent, eventName, payload, result});
        }

        return results;
    }
}


// This class is used with JSTree to keep browser working with ease, even with several tens of MBs JSON data file.
class LargeDomEventListenersOverheadOptimizer extends EventsEmitter
{
    constructor() {
        super();

        this.eventsHandlersSetDom = {};
        this.mainHolderHtmlNode = null;

        this.EventArtDOMEventOptimized = 'DOMEventOptimized';
    }

    addDomEventListeners() {
        // here is just the right assignment of few dom event listeners.
        // Don't edit here, please!
        for (let eventName in this.eventsHandlersSetDom) {
            let eventHandlers = this.eventsHandlersSetDom[eventName];
            if (this.isObjectEmpty(eventHandlers)) {
                continue;
            }

            // here we add one dom event listener for each event, like click, contextmenu, dblcick and others, when any
            this.mainHolderHtmlNode.addEventListener(eventName, this.optimizedDomEventHandler.bind(this));
        }
    }


    // this method just sets an event handler function by event name and a holder elem selector to an object, 
    // and then all event handlers are executed on this.emitDomEvent method call.
    // The difference is, that we addEventListener once to the main html node,
    // and not to each html node, it is best, when the html tool is populated with a larger json data file of several tens or hundreds MBs, for example.
    addDomEventListener(eventName, selector, eventHandler) {
        if (!this.eventsHandlersSetDom[eventName]) {
            this.eventsHandlersSetDom[eventName] = {};
        }

        if (!this.eventsHandlersSetDom[eventName][selector]) {
            this.eventsHandlersSetDom[eventName][selector] = [];
        }
        
        this.eventsHandlersSetDom[eventName][selector].push(eventHandler);

        return this;
    }


    // Don't edit here, please
    emitDomEvent (eventName, payload) {
        const results = [];

        let eventHandlersBySelectors = this.eventsHandlersSetDom[eventName];
        if (this.isObjectEmpty(eventHandlersBySelectors)) {
            return results;
        }
        
        for (let selector in eventHandlersBySelectors) {
            const eventHandlers = eventHandlersBySelectors[selector];
            if (!eventHandlers || eventHandlers.length === 0) {
                continue;
            }

            const eventTarget = payload.event.target.closest(selector);
            if (!eventTarget) {
                continue;
            }

            payload['eventTarget'] = eventTarget;

            for (let eventHandler of eventHandlers) {
                if (!eventHandler || (typeof eventHandler) !== 'function') {
                    continue;
                }

                const result = eventHandler.call(this, payload);
                results.push({eventArt: this.EventArtDOMEventOptimized, eventName, selector, payload, result});
            }
        }

        return results;
    }

    optimizedDomEventHandler(event) {
        const eventTarget = event.target;
        if (
            eventTarget.nodeName === 'A' &&
            eventTarget.getAttribute('HREF') !== 'javascript: void(0);'
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        
        if (this.isObjectEmpty(this.eventsHandlersSetDom)) {
            return;
        }
        
        const eventName = event.type;
        let eventHandlers = this.eventsHandlersSetDom[eventName];
        if (this.isObjectEmpty(eventHandlers)) {
            return;
        }
        
        if (this.debug === true) {
            console.log('optimized event handler');
        }

        this.emitDomEvent (
            eventName,
            { event }
        );
    }
}



class TemplateRenderer extends EventsEmitter {
    constructor() {
        super();

        this.data = {};
        this.template = '';

        this.EVENT_NAME__AFTER_RENDER = 'afterRender';
    }

    setData(data) {
        this.data = data;
        return this;
    }
    setTemplate(template) {
        this.template = template;
        return this;
    }

    renderHtmlTemplateWithEvent() {
        let renderedHtml = this.replaceTemplateWithDataForRendering (
            this.template,
            this.data
        );

        if (this.debug) {
            console.log('renderedHtml before afterRender event emitted', renderedHtml);
        }

        const eventResult = this.emitEvent(
            this.EVENT_NAME__AFTER_RENDER,
            {
                html: renderedHtml,
                data: this.data
            }
        );

        if (eventResult.length > 0) {
            renderedHtml = eventResult[0].result;

            if (this.debug) {
                console.log('renderedHtml before afterRender event emitted', eventResult, renderedHtml);
            }
        } else {
            if (this.debug) {
                console.log('afterRender event did not change html');
            }
        }

        return renderedHtml;
    }

    replaceTemplateWithDataForRendering(template, dataForRendering) {
        let renderedHtml = template;

        for (let placeholderName in dataForRendering) {
            
            const stringToReplace = `{{ ${placeholderName} }}`;
            
            let valueToSet = dataForRendering[placeholderName];
            if (!valueToSet) {
                valueToSet = '';
            }

            renderedHtml = renderedHtml.replace(stringToReplace, valueToSet);
        }

        return renderedHtml;
    }
}


class ContextMenuJsonFields {
    constructor() {
        this.ITEM_ICON_SRC = 'icon';
        this.ITEM_LABEL_TEXT = 'label';
        this.ITEM_CSS_CLASS = 'class';
        this.ITEM_ACTION = 'action';
    }
}

const contextMenuJson = [
    {
        'icon': '/jstree/www/images/custom-theme-icons/money-transfer.png',
        'label': 'Edit',
        'action': 'edit'
    },
    {
        'icon': '/jstree/www/images/custom-theme-icons/house.png',
        'label': 'Insert new',
        'action': 'insert'
    },
    {
        'icon': '/jstree/www/images/icons/button-without-subtree.svg',
        'label': 'Drop this node',
        'action': 'drop'
    }
];

class JSONContextMenu {
    constructor() {
        
        this.json = null;

        this.CLASS_AND_IDPREFIX__CONTEXT_MENU = 'json-context-menu-holder';
        this.TEMPLATE__CONTEXT_MENU_ITEM = `
    <li class="{{ class }}">
        <pre class="json-context-menu-item-holder-icon">
            <img src="{{ icon }}" />
        </pre>
        <label class="json-context-menu-item-label" data-action="{{ action }}">{{ label }}</label>
    </li>
        `;

        this.templateRenderer = new TemplateRenderer();
        this.jsonFields = new ContextMenuJsonFields();
    }

    render(relativeHtmlElement, id, json) {
        this.templateRenderer
            .setTemplate(this.TEMPLATE__CONTEXT_MENU_ITEM);

        let html = '<ul class="' + this.CLASS_AND_IDPREFIX__CONTEXT_MENU + '">';

        for (let node of json) {
            html += this.renderItem(node);
        }

        html += '</ul>';

        relativeHtmlElement.insertAdjacentHTML (
            "beforeend",
            html
        );

        const contextMenuHtmlNode = relativeHtmlElement.querySelector (
            '#' +
            this.CLASS_AND_IDPREFIX__CONTEXT_MENU +
            this.mainHtmlNodeId
        );

        return contextMenuHtmlNode;
    }

    renderItem(node) {
        const templateData = this.getDataForTemplateRenderer(node);

        const itemHtml = this.templateRenderer
            .setData(templateData)
            .renderHtmlTemplateWithEvent();
        
        return itemHtml;
    }

    getDataForTemplateRenderer(node) {
        const data = {
            "icon": node[this.jsonFields.ITEM_ICON_SRC],
            "class": node[this.jsonFields.ITEM_CSS_CLASS],
            "label": node[this.jsonFields.ITEM_LABEL_TEXT],
            "action": node[this.jsonFields.ITEM_ACTION],
        };

        return data;
    }

    destroyContextMenu(id) {
        const contextMenuHtmlNode = document.getElementById(this.CLASS_AND_IDPREFIX__CONTEXT_MENU + id);
        contextMenuHtmlNode.remove();
    }
}


// This class renders context menu to modify JSTree nodes.
class JSTreeUpdater {
    constructor() {
        this.CLASS_AND_ID__CONTEXT_MENU = 'jstree-context-menu-holder';

        this.isUpdatingOnServerSide = false;
        this.isUploadingJsonFile = false;
        this.isSavingWithApi = false;

        this.json = null;

        this.TEMPLATE__CONTEXT_MENU = `
<ul class="jstree-context-menu-holder">
    <li>
        <pre class="jstree-context-menu-item-holder-icon">
            <img src="/jstree/www/images/custom-theme-icons/folder.png" />
        </pre>
        <label class="jstree-context-menu-item-label" data-action="insert">Insert new node</label>
    </li>
    <li>
        <pre class="jstree-context-menu-item-holder-icon">
            <img src="/jstree/www/images/custom-theme-icons/folder.png" />
        </pre>
        <label class="jstree-context-menu-item-label" data-action="modify">Modify</label>
    </li>
    <li>
        <pre class="jstree-context-menu-item-holder-icon">
            <img src="/jstree/www/images/custom-theme-icons/folder.png" />
        </pre>
        <label class="jstree-context-menu-item-label" data-action="drop">Drop this node</label>
    </li>
</ul>        
        `;
    }

    contextmenuEventHandler(event) {
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

        this.updateContextMenu(
            event, 
            subtreeContainer, 
            currentTreeNodeContainer, 
            contextMenuContainer, 
            labelElem
        );
    }

    closeContextMenuIfBeyoundContextmenuClick(event) {
        const isClickBeyoundContextMenu = event.target.closest(this.CLASS_AND_ID__CONTEXT_MENU) === null;
        if (isClickBeyoundContextMenu) {
            const contextMenuContainer = document.getElementById(this.CLASS_AND_ID__CONTEXT_MENU);
            if (contextMenuContainer && contextMenuContainer.style) {
                contextMenuContainer.style.display = 'none';
            }
        }
    }

    addEventListeners() {
        document.addEventListener('contextmenu', this.contextmenuEventHandler.bind(this));
        document.addEventListener('click', this.closeContextMenuIfBeyoundContextmenuClick.bind(this));
    }

    updateContextMenu(event, container, li, contextMenuContainer, titleElem) {
        let ulCM = document.createElement('UL');
        ulCM = contextMenuContainer.appendChild(ulCM);

        let liAppend = document.createElement('LI');
        liAppend.innerHTML = 'Append subtree node';
        liAppend = ulCM.appendChild(liAppend);
        liAppend.onclick = function(){
            contextMenuContainer.style.display = 'none';
            const node = {title: 'new node', href: 'javascript: void(0);', parents: parseInt(li.getAttribute('data-id'))};
            let subtreeElemsContainer = null;
            let lastSubtreePosition = 0;
            try{
                subtreeElemsContainer = li.getElementsByTagName('UL')[0];
            }catch(e){}
            if(!subtreeElemsContainer){
                subtreeElemsContainer = document.createElement('UL');
                subtreeElemsContainer = li.appendChild(subtreeElemsContainer);
                const toggleButton = li.getElementsByClassName(this.CLASS_NOCHILDREN)[0];
                toggleButton.className = this.CLASS_OPEN;
                const ul = subtreeElemsContainer;
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
                    lastSubtreePosition = parseInt(subtreeElemsContainer.lastSubtree.getAttribute('data-position'));
                }catch(e){}
            }
            node.position = lastSubtreePosition+1;

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                const newNode = JSON.parse(xhr.responseText);
                const newLi = this.renderOneTreeNode(node, subtreeElemsContainer);
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
            'parents': li.getAttribute('data-holderid'),
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


// Constants, used to map Your JSON fields to JSTree constants.
// e.g. in Your JSON the text inside the tree node is the JSON field "text"
// e.g. [{"text": "Home"},{"text": "Job"}]
// then, modify this class like this: this.NODE_LABEL__TEXT = 'text';
// You can use setter after JSTree initalization, before render() or load() methods call, 
// like this: tree.setJsonFieldsNames(new JSTreeJsonNodeFieldsNames()) 
// each class also, having same properties names,
// or an object setting all Your JSON fields names: 
// tree.setJsonFieldsNames({NODE_LABEL__TEXT: 'label', SUBTREE: 'subtree', NODE__CSS_CLASS_NAME: 'class'})
class JSTreeJsonNodeFieldsNames {
    constructor() {
        this.NODE_ICON__SRC = 'icon';
        this.NODE_LABEL__TEXT = 'label';
        this.SUBTREE = 'subtree';

        this.NODE__ID = 'id';
        this.NODE__HOLDER_ID = 'holderId';
        this.NODE__PATH = 'PATH';
        this.NODE__ORDER = 'order';

        this.NODE__HYPERLINK = 'href';
        this.NODE__OPENED = 'opened';
        this.NODE__CSS_CLASS_NAME = 'cssClassName';
        this.NODE__ART = 'art';
    }
}

// Here is the object template with same purpose, to copy, modify and use.
const jsTreeJsonNodeFieldsNames = {
    NODE_ICON__SRC: 'icon',
    NODE_LABEL__TEXT: 'label',
    SUBTREE: 'subtree',

    NODE__ID: 'id',
    NODE__HOLDER_ID: 'holderId',
    NODE__PATH: 'id',
    NODE__ORDER: 'order',

    NODE__HYPERLINK: 'href',
    NODE__OPENED: 'opened',
    NODE__CSS_CLASS_NAME: 'cssClassName',
    NODE__ART: 'art',
}


// JSTree main class
class JSTree extends LargeDomEventListenersOverheadOptimizer
{
    constructor() {
        super();

        this.mainHtmlNodeId = '';
        this.url = '';
        this.isModifiable = false;

        this.debug = false;

        this.CLASS_OPENED = 'toggle-with-subtree-opened';
        this.CLASS_WITHOUT_SUBTREE = 'toggle-without-subtree';
        this.CLASS_ICON_SHOW = 'icon-show';
        this.CLASS_ICON_HIDE = 'icon-hide';

        this.CLASS_AND_ID__CONTEXT_MENU = 'context-menu-container';

        this.EVENT_NAME__AFTER_RENDER_ONE_NODE = 'afterRenderOneNode';
        this.EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK = 'openButtonClick';
        this.EVENT_NAME__TREE_NODE_LABEL__CLICK = 'treeNodeLabelClick';

        this.jsonFieldsNames = new JSTreeJsonNodeFieldsNames();

        this.TEMPLATE__TREE_HTML_NODE = `
<li 
    data-id="{{ data-id }}" 
    data-holder-id="{{ data-holder-id }}" 
    data-order="{{ data-order }}">

    <pre class="jstree-html-node" data-json="{{ data-json }}">
        <pre class="open-button  {{ openButtonStateClassName }}">
            <pre class="opened"></pre>
            <pre class="closed"></pre>
            <pre class="without-subtree"></pre>
            <pre class="animated"></pre>
        </pre>

        <pre class="jstree-html-node-holder-icon {{ iconShow-className }}">
            <img src="{{ icon-src }}" />
        </pre>

        <a href="{{ hyperlink }}" class="jstree-html-node-label">{{ label-text }}</a>
    </pre>
    
    <ul></ul>
</li>        
        `;

        this.templateRenderer = new TemplateRenderer();
        this.templateRenderer
            .addThisClassEventListener (
                this.templateRenderer.EVENT_NAME__AFTER_RENDER,
                ({html, data}) => {
                    let renderedHtml = html;

                    if (!data.hasSubtree) {
                        renderedHtml = html.replace('<ul></ul>', '');
                    }

                    return renderedHtml;
                }
            );

        this.contextMenuJSClass = null;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }
    setMainHtmlNodeId(mainHtmlNodeId) {
        this.mainHtmlNodeId = mainHtmlNodeId;
        return this;
    }
    setJsonFieldsNames(obj) {
        this.jsonFieldsNames = obj;
        return this;
    }
    setModifiable(isModifiable) {
        this.isModifiable = isModifiable;
        return this;
    }

    load(){
        if(!this.url || !this.mainHtmlNodeId){
            return;
        }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
                this.addJSTreeEventListeners();
            });
    }

    render(nodes){
        this.mainHolderHtmlNode = document.getElementById(this.mainHtmlNodeId);
        this.mainHolderHtmlNode.className = 'tree';
        let ul = document.createElement('UL');
        this.mainHolderHtmlNode.append(ul);
        const count = nodes.length;
        let node = null;
        for(let i=0; i<count; i++){
            node = nodes[i];
            nodes[i] = this.renderOneTreeNode(node, ul).node;
        }

        this.json = [...nodes];
        console.log('this.json', this.json);

        return this;
    }


    renderOneTreeNode(node, holder) {
        let id = node[this.jsonFieldsNames.NODE__ID];
        let holderId = node[this.jsonFieldsNames.NODE__HOLDER_ID];
        let holderJson = null;

        if (!holderId) {
            const holderLiNode = holder.closest('li');
            if (holderLiNode) {
                holderJson = this.getTreeHtmlNodeDatasetJson(holderLiNode.querySelector('.jstree-html-node'));
                holderId = holderJson[this.jsonFieldsNames.NODE__ID];
            } else {
                holderId = this.mainHtmlNodeId + 'Main';
                holderJson = {};
            }
            
            node[this.jsonFieldsNames.NODE__HOLDER_ID] = holderId;
        }

        if (!holderJson[this.jsonFieldsNames.NODE__PATH]) {
            holderJson[this.jsonFieldsNames.NODE__PATH] = [holderId];
        }

        if (!id) {
            id = holderId + '_' + holder.getElementsByTagName('li').length;
            node[this.jsonFieldsNames.NODE__ID] = id;
        }

        node[this.jsonFieldsNames.NODE__PATH] = [
            ...holderJson[this.jsonFieldsNames.NODE__PATH],
            id
        ];

        const subtreeJsonNodes = node[this.jsonFieldsNames.SUBTREE];
        const hasSubtree = !!subtreeJsonNodes;

        const nodeClone = {...node};
        delete(nodeClone[this.jsonFieldsNames.SUBTREE]);
        nodeClone.hasSubtree = hasSubtree;

        const dataForRendering = this.getDataForRendering(nodeClone);
        
        const nodeHtml = this.templateRenderer
            .setTemplate(this.TEMPLATE__TREE_HTML_NODE)
            .setData(dataForRendering)
            .renderHtmlTemplateWithEvent();

        holder.insertAdjacentHTML (
            'beforeend',
            nodeHtml
        );
    
        const li = holder.querySelector('li:last-of-type');
        const className = node[this.jsonFieldsNames.NODE__CSS_CLASS_NAME];
        if (className) {
            li.className = className;
        }
    
        const eventAfterRenderOneNodePayload = {
          "eventName": this.EVENT_NAME__AFTER_RENDER_ONE_NODE,
          "treeHtmlNode": li,
          "treeItemJson": nodeClone
        };
    
        if(!hasSubtree){
            this.emitEvent (
              this.EVENT_NAME__AFTER_RENDER_ONE_NODE, 
              eventAfterRenderOneNodePayload
            );
    
            return { currentNodeSubtreeLength: 0, node: {...node}};
        }
    
        let ul = li.getElementsByTagName('UL')[0];
    
        if (node[this.jsonFieldsNames.NODE__OPENED] === true) {
            ul.style.display = 'block';
        } else {
            ul.style.display = 'none';
        }
    
        const subtreeJsonNodesLength = subtreeJsonNodes.length;
        let subtreeJsonNode = null;
        let currentNodeSubtreeLength = 0;
        for(let i = 0; i < subtreeJsonNodesLength; i++){
            subtreeJsonNode = subtreeJsonNodes[i];
            const renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
            currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
            node[this.jsonFieldsNames.SUBTREE][i] = {...renderResult.node};
        }
        currentNodeSubtreeLength += subtreeJsonNodesLength;
    
        nodeClone.subtreeLength = subtreeJsonNodesLength;
        nodeClone.subtreeLengthDeep = currentNodeSubtreeLength;
    
        this.emitEvent (
          this.EVENT_NAME__AFTER_RENDER_ONE_NODE, 
          eventAfterRenderOneNodePayload
        );
    
        return { currentNodeSubtreeLength, node: {...node}};
    }

    getDataForRendering(node) {
        let openButtonClassName = '';
        if ( !node.hasSubtree ) {
            openButtonClassName = this.CLASS_WITHOUT_SUBTREE;
        } else if (node[this.jsonFieldsNames.NODE__OPENED]) {
            openButtonClassName = this.CLASS_OPENED;
        }

        const dataForRendering = {
            "data-id": node[this.jsonFieldsNames.NODE__ID],
            "data-holder-id": node[this.jsonFieldsNames.NODE__HOLDER_ID],
            "data-order": node[this.jsonFieldsNames.NODE__ORDER],
            "data-json": this.escapeHTMLForAttribute(JSON.stringify(node)),
            "openButtonStateClassName": openButtonClassName,
            "icon-src": node[this.jsonFieldsNames.NODE_ICON__SRC],
            "iconShow-className": (node[this.jsonFieldsNames.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            "label-text": node[this.jsonFieldsNames.NODE_LABEL__TEXT],
            "hyperlink": node[this.jsonFieldsNames.NODE__HYPERLINK] ?? 'javascript: void(0);',
            "hasSubtree": node.hasSubtree,
        };

        return dataForRendering;
    }

    escapeHTMLForAttribute(str) {
        return str
          .replace(/"/g, "&quot;")  // Replace double quotes
          .replace(/'/g, "&#39;")   // Replace single quotes
          .replace(/</g, "&lt;")    // Replace <
          .replace(/>/g, "&gt;");   // Replace >
    }

    unescapeHTMLFromAttribute(str) {
        return str
          .replace(/&quot;/g, "\"")  // Replace double quotes
          .replace(/&#39;/g, "'")   // Replace single quotes
          .replace(/&lt;/g, "<")    // Replace <
          .replace(/&gt;/g, ">");   // Replace >
    }

    getTreeHtmlNodeDatasetJson(htmlNode) {
        return JSON.parse(this.unescapeHTMLFromAttribute(htmlNode.dataset.json));
    }


    addJSTreeEventListener (eventName, eventHandler) {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addThisClassEventListener(eventName, eventHandler);

        return this;
    }


    // the predefined events handlers
    addJSTreeEventListeners() {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        // Here is the predefined open button handler,
        // In Your custom code, this way You can define event handlers for heavy tree json data,
        // and the tree will not be overloaded of large number of events listeners on many html nodes. 
        this.addDomEventListener (
            'click',
            '.open-button',
            this.openButtonClickHandler
        );

        this.addDomEventListener (
            'click',
            '.jstree-html-node-label',
            this.treeNodeLableClickHandler
        );

        if (this.isModifiable) {
            this.addDomEventListener (
                'dblclick',
                '.jstree-html-node-holder-icon',
                this.contextMenuRender
            )
        }

        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addDomEventListeners();
        
        return this;
    }


    // the predefined events handlers
    openButtonClickHandler(eventPayload) {
        const toggleButton = eventPayload.eventTarget;
        if (
            toggleButton.classList.contains(this.CLASS_WITHOUT_SUBTREE)
        ) {
            return;
        }

        eventPayload.event.preventDefault();
        eventPayload.event.stopPropagation();

        let subtreeContainer = toggleButton.closest('li').getElementsByTagName('ul')[0];
        const isOpened = toggleButton.classList.contains(this.CLASS_OPENED);
        if (isOpened) {
            toggleButton.classList.remove(this.CLASS_OPENED);
            subtreeContainer.style.display = 'none';
        } else {
            toggleButton.classList.add(this.CLASS_OPENED);
            subtreeContainer.style.display = 'block';
        }

        this.emitEvent (
            this.EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK,
            eventPayload
        );
    }

    // the predefined events handlers
    treeNodeLableClickHandler(eventPayload) {
        const treeHtmlNode = eventPayload.eventTarget.closest('.jstree-html-node');

        const jsonNode = JSON.parse(this.unescapeHTMLFromAttribute(treeHtmlNode.dataset.json));
        if (this.debug === true) {
            console.log(eventPayload.event.type, treeHtmlNode, jsonNode);
        }

        this.emitEvent (
            this.EVENT_NAME__TREE_NODE_LABEL__CLICK,
            {
                ...eventPayload,
                jsonNode,
                treeHtmlNode,
                treeHtmlNodeHolder: treeHtmlNode.closest('li'),
            }
        );
    }

    contextMenuRender(eventPayload) {
        if (!this.contextMenuJSClass) {
            this.contextMenuJSClass = new JSONContextMenu();
        }

        const treeHtmlNode = eventPayload.eventTarget.closest('li').querySelector('.jstree-html-node');
        
        const contextMenuHtmlNode = this.contextMenuJSClass
            .render(treeHtmlNode, this.mainHtmlNodeId, contextMenuJson);
        
        contextMenuHtmlNode.style.display = 'block';
    }
}

