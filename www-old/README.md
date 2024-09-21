# jstree
JavaScript Tree Navigation Tool
Requires no jQuery or similar, native javascript used.

how to use:

window.addEventListener('DOMContentLoaded', function(){

// draw a tree navbar from xml datasource. tree.type = tree.TYPE_XML by default.
    var tree = new Tree();
    tree.elementId = 'tree';
    tree.src = 'http://localhost/tree/xml/tree-data.xml';
    tree.load();

// draw a tree navbar from json datasource
    var tree2 = new Tree();
    tree2.elementId = 'tree-from-json';
    tree2.type = tree2.TYPE_JSON;
    tree2.src = 'http://localhost/tree/json/tree-data.json';
    tree2.load();
});

just set src property to url of the datasource, specify the type TYPE_XML or TYPE_JSON,
set parent container htmlelment id,
call load() method.

done!
