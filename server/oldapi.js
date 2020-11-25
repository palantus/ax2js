"use strict"

var MetadataHandler = require('./metadatahandler.js')
var metaHandler = new MetadataHandler()

class API{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
    this.allTypes = ["class", "table", "edt", "enum", "form", "displaymenuitem", "menu"]
  }

  async init(){
    await metaHandler.init();
  }

  handleElementRequest(requestPath, query){
    var self = this;
    var id = requestPath[0];

    if(id == ""){
      this.respond(JSON.stringify({error: "element not provided", requestPath: requestPath, query: query}))
    } else if(isNaN(id)){
      metaHandler.getElementByNameAndType(requestPath[1], requestPath[0], function(r){
        self.handleElementRequestInner.call(self, requestPath.slice(2), r, query)
      })
    } else {
      metaHandler.getElementById(id, function(r){
        self.handleElementRequestInner.call(self, requestPath.slice(1), r, query)
      })
    }
  }

  handleElementRequestInner(requestPath, dbElement, query){
    var self = this;

    if(dbElement == undefined){
        self.respond(JSON.stringify({error: "element not found", requestPath: requestPath, query: query}))
        return;
    }
    var element = JSON.parse(dbElement.content)

    //Request for all element data
    if(requestPath.length == 0){
      self.respond(JSON.stringify(element))
      return;
    }

    switch(requestPath[0]){
      case "source":
        if(["class", "table", "edt", "enum"].indexOf(element.type) < 0){
          self.respond(JSON.stringify({error: "No source code found for element " + element.name + " of type " + element.type, requestPath: requestPath, query: query}))
          return;
        }

        var methodName = (requestPath.length < 1 || ["js", "xpp", "ast"].indexOf(requestPath[1])) >= 0 ? requestPath[2] : requestPath[1];

        // X++
        if(requestPath[1] == "xpp"){
          let source = "";
          if(methodName){
            for(let i = 0; i < element.methods.length; i++)
              if(element.methods[i].name.toLowerCase() == methodName.toLowerCase())
                source = element.methods[i].source;
          } else {
            for(let i = 0; i < element.methods.length; i++)
              source += element.methods[i].source + "\r\n";
          }
          self.respond(source, 'text/plain')

        // AST
        } else if(requestPath[1] == "ast"){
          let ast = {};
          if(methodName){
            for(let i = 0; i < element.methods.length; i++)
              if(element.methods[i].name.toLowerCase() == methodName.toLowerCase())
                ast = element.methods[i].ast;
          } else {
            for(let i = 0; i < element.methods.length; i++)
              ast[element.methods[i].name] = element.methods[i].ast
          }
          self.respond(JSON.stringify(ast, null, 2))

        // Javascript
        } else if(requestPath.length <= 1 || requestPath[1] != ""){

          if(methodName !== undefined){
            let found = false;
            for(let i = 0; i < element.methods.length; i++){
              if(element.methods[i].name.toLowerCase() == methodName.toLowerCase()){
                self.respond(element.methods[i].jsSource, 'application/javascript')
                found = true;
              }
            }
            if(!found)
              self.respond(JSON.stringify({error: "Method not found"}))
          } else {
            self.respond(element.jsSource, 'application/javascript')
          }
        }
        return true;

      case "depsource":
        metaHandler.getElementsInList(element.dependenciesRecursive, {include: ["basic", "jsSource"]}, function(res){
          self.respond(JSON.stringify(res))
        })
        return true;

      case "compile":
        metaHandler.compileElement(dbElement, function(result){
          self.respond(JSON.stringify(result))
        })
        return true;

      case "prop":
      case "props":
      case "properties":
        let basic = {name: dbElement.name, id: dbElement.id, layer: dbElement.layer, type: dbElement.type}
        let props = element.properties;
        self.respond(JSON.stringify({basic: basic, extended: props}))
        return true;
      default :
        self.respond()
    }

    return false;
  }

  handleTreeRequest(requestPath, query){
    var self = this;

    if(requestPath[0] == "all" || requestPath[0] == undefined){
      metaHandler.getElementList(null, function(r){
        self.respond(JSON.stringify(r))
      })
      return true;

    } else if(requestPath.length == 1 && self.allTypes.indexOf(requestPath[0]) >= 0){
      metaHandler.getElementList(requestPath[0], function(r){
        self.respond(JSON.stringify(r))
      })
      return true;

    // Get sub-items (eg. methods)
    } else if(requestPath.length == 2 && self.allTypes.indexOf(requestPath[0]) >= 0){
      if(requestPath[0] == "class"){
        metaHandler.getElementByNameAndType(requestPath[1], requestPath[0], function(r){
          let methods = [];
          if(r !== undefined){
            let element = JSON.parse(r.content);
            for(let i = 0; i < element.methods.length; i++)
              methods.push({name: element.methods[i].name, type: "method"})
          }
          self.respond(JSON.stringify(methods))
        })

      } else if(requestPath[0] == "menu"){
        metaHandler.getElementByNameAndType(requestPath[1], requestPath[0], function(r){
          let menuItems = [];
          if(r !== undefined){
            let element = JSON.parse(r.content);
            for(let i = 0; i < element.menuItems.length; i++)
              menuItems.push({
                                name: element.menuItems[i].Name,
                                label: element.menuItems[i].MenuItemName,
                                menuItem: element.menuItems[i].MenuItemName,
                                type: "menumenuitem"})
          }
          self.respond(JSON.stringify(menuItems))
        })
      } else {
        self.respond(JSON.stringify([]))
      }
      return true;
    }
    return false;
  }
}

module.exports = API
