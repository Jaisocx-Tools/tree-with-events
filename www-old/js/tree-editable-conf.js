window.addEventListener('DOMContentLoaded', function(){
    var tree3 = new TreeEditable();
    tree3.elementId = 'tree-editable-from-json';
    tree3.type = tree3.TYPE_JSON;
    tree3.src = 'http://increase.loc/api/hierarchy';
    tree3.accessToken = 'Bearer AccessToken_For_Admin';
    tree3.load();
});
