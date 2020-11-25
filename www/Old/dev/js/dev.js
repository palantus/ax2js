"use strict"

class AX2JS{
  constructor(){
    this.editor = null;
  }

  run(){
    var self = this;
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.resize()
    this.editor.$blockScrolling = Infinity

    var jsTree = $('#elements').jstree({
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
      self.onItemClicked(data.node)
    });
  }

  getTreeChildren(obj, cb){
    if(obj.parent == null){
      cb([
          {text: "Tables", axtype: "table", children: true},
          {text: "Classes", axtype: "class", children: true},
          {text: "Forms", axtype: "form", children: true},
          {text: "Data Types", axtype: "edt", children: true},
          {text: "Enumerations", axtype: "enum", children: true},
          {text: "Menus", axtype: "menu", children: true},
          {text: "Menu items - display", axtype: "displaymenuitem", children: true}
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
          elements.push({text: response[i].label ? response[i].label : response[i].name, axid: obj.original.axid, axtype: response[i].type, axchildpath: childPath})
        }
        cb(elements)
      })
    } else {
      cb([])
    }
  }

  createRightClickMenu(node){
    var self = this;
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

    return items
  }

  onItemClicked(node){
    let self = this;

    if(node !== undefined && node.parent != "#"){
      var item = node.original;
      if(["class", "table", "edt", "enum"].indexOf(item.axtype) >= 0){
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

      $.get("/api/element/" + item.axid + "/props", function(response){

        let html = "<h3>Properties</h3>"
                 + "<h4>Basic</h4>"
                 + "<table cellspacing='0'>"
        for(let key in response.basic)
          html += "<tr><td>" + key + ":</td><td>" + response.basic[key] + "</td></tr>"

        html += "</table>"
             +  "<h4>Extended</h4>"
             +  "<table cellspacing='0'>"

        for(let key in response.extended)
         html += "<tr><td>" + key + ":</td><td>" + response.extended[key] + "</td></tr>"

        html += "</table>"

        $("#properties").html(html);
      })
    } else {
      $("#properties").html("");
    }
  }
}

$(function() {
  new AX2JS().run();
});
