"use strict"

class AX2JS{
  constructor(){
  }

  run(){
    var self = this;

    var jsTree = $('#menu').jstree({
      'core' : {
        'data' : self.getTreeChildren
      },
      "plugins" : ['state','dnd','contextmenu','wholerow', 'sort'],
      "contextmenu": {items: function(node){
                          return self.createRightClickMenu.call(self, node)
                        }
      }
    });

    $('#elements').on("changed.jstree", function (e, data) {
      if(data.node !== undefined && data.node.parent != "#")
        self.onItemClicked(data.node.original)
    });
  }

  getTreeChildren(obj, cb){
    cb([{text: "Menu"}])
    /*
    if(obj.parent == null){
      cb([
          {text: "Tables", axtype: "table", children: true},
          {text: "Classes", axtype: "class", children: true},
          {text: "Forms", axtype: "form", children: true},
          {text: "Data Types", axtype: "edt", children: true},
          {text: "Enumerations", axtype: "enum", children: true}
        ])
    } else if(obj.parents.length == 1){
      $.get("/api/tree/" + obj.original.axtype, function(response){
        let elements = [];
        for(let i = 0; i < response.length; i++){
          elements.push({text: response[i].name, axid: response[i].id, axtype: response[i].type, children: true})
        }
        cb(elements)
      })
    } else if(obj.parents.length >= 2){
      let childPath = obj.original.axchildpath !== undefined ? obj.original.axchildpath + "/" + obj.original.text : obj.original.text
      $.get("/api/tree/" + obj.original.axtype + "/" + childPath, function(response){
        let elements = [];
        for(let i = 0; i < response.length; i++){
          elements.push({text: response[i].name, axid: obj.original.axid, axtype: "method", axchildpath: childPath})
        }
        cb(elements)
      })
    } else {
      cb([])
    }
    */
  }

  createRightClickMenu(node){
    var self = this;
    var items = {};
    /*
    var items = {
        compileFromXPP: {
            label: "Compile From X++",
            action: function () {
              $.get("/api/element/" + node.original.axid + "/compile", function(response){
                console.log(response);
                self.onItemClicked(node.original)
              })
            }
        },
        viewXPP: {
            label: "Show X++ code",
            action: function () {
              $.get("/api/element/" + node.original.axid + "/source/xpp", function(response){
                self.editor.getSession().setMode("ace/mode/java");
                self.editor.setValue(response);
                self.editor.gotoLine(1);
              });
            }
        },
        viewAST: {
            label: "Show AST",
            action: function () {
              $.post("/api/element/" + node.original.axid + "/source/ast", function(response){
                self.editor.getSession().setMode("ace/mode/json");
                self.editor.setValue(response);
                self.editor.gotoLine(1);
              });
            }
        }
    };

    if(node.original.axtype != "class" && node.original.axtype != "table"){
      delete items.compileFromXPP;
      delete items.viewXPP;
      delete items.viewAST;
    }
    */
    return items
  }

  onItemClicked(item){
    let self = this;
    /*
    if(item.axtype == "class" || item.axtype == "table"){
      $.get("/api/element/" + item.axid + "/source/js", function(response){
        self.editor.getSession().setMode("ace/mode/javascript");
        self.editor.setValue(response);
        self.editor.gotoLine(1);
      });
    } else if(item.axtype == "method"){
      $.get("/api/element/" + item.axid + "/source/js/" + item.text, function(response){
        self.editor.getSession().setMode("ace/mode/javascript");
        self.editor.setValue(response);
        self.editor.gotoLine(1);
      });
    }
    */
  }
}

$(function() {
  new AX2JS().run();
});
