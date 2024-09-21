"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const tree = new JSTree();
    tree.elementId = 'jstree-01';
    tree.url = '/jstree/www/data/tree-data.json';
    tree.load();
});
