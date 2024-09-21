"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const tree = new Tree();
    tree.elementId = 'tree';
    tree.src = 'ajax-data/tree-data.xml';
    tree.load();

    const tree2 = new Tree();
    tree2.elementId = 'tree-from-json';
    tree2.type = tree2.TYPE_JSON;
    tree2.src = 'ajax-data/tree-data.json';
    tree2.load();
});
