'use strict';

var XPPCompiler = require("./compilers/xpp2js.js")
let Element = require("../models/element.js")

class MetadataHandler{

 constructor(){
   
 }

 async init(){
  await Element.init("./data");
 }

fillDependencies(elements){
  var elementNames = new Set()
  var name2idx = {}
  for(let i = 0; i < elements.length; i++){
    elementNames.add(elements[i].name)
    name2idx[elements[i].name] = i;
  }

  // First add all local dependencies
  for(let i = 0; i < elements.length; i++){
    if(elements[i].methods === undefined)
      continue;

    let dependencies = [];

    for(let m = 0; m < elements[i].methods.length; m++){
      if(elements[i].name != "SPBusinessLogic")
        continue;

      dependencies = dependencies.concat(this._findDependenciesRecursiveAST(elements[i].methods[m].ast))
    }

    elements[i].dependencies = [];
    for(let k of new Set(dependencies).values()){
      if(elementNames.has(k) && k != null)
        elements[i].dependencies.push(k);
    }
    elements[i].dependencies.push("Global"); //All elements needs to depend on Global
  }

  // Then add dependencies of dependencies
  var seenElementsSet = new Set()
  for(let i = 0; i < elements.length; i++){
    if(elements[i].dependencies === undefined || elements[i].dependencies.length == 0)
      continue;

    if(!seenElementsSet.has(elements[i].name))
      elements[i].dependenciesRecursive = [...new Set(this._findDependenciesRecursive(elements, elements[i].name, name2idx, seenElementsSet))]
  }
}

_findDependenciesRecursive(elements, elementName, name2idx, seenElementsSet){
  seenElementsSet.add(elementName);
  let e = elements[name2idx[elementName]];
  if(e.dependencies === undefined || e.dependencies.length == 0)
    return [];

  let deps = e.dependencies;

  for(let dep in deps){
    if(!seenElementsSet.has(deps[dep])){
      let childElementDeps = this._findDependenciesRecursive(elements, deps[dep], name2idx, seenElementsSet)
      e.dependenciesRecursive = childElementDeps;
      deps = deps.concat(childElementDeps);
    }
  }

  return deps;
}

_findDependenciesRecursiveAST(ast){
  let deps = [];
  if(ast === undefined)
    return deps;

  if(ast instanceof Array){
    for(let i = 0; i < ast.length; i++)
      deps = deps.concat(this._findDependenciesRecursiveAST(ast[i]))
    return deps;
  }

  if(ast.type == "id" && typeof ast.id === 'string'){
    deps.push(ast.id)
  } else if(typeof ast === 'object'){
    for(let key in ast){
      deps = deps.concat(this._findDependenciesRecursiveAST(ast[key]))
    }
  }

  return deps;
}

 saveElementsToDatabase(elements, deleteExisting, cb){
   if(deleteExisting){
    this._deleteAllElements(function(){
      this._doSaveElements(elements, true, cb);
    })
  } else {
    this._doSaveElements(elements, false, cb);
  }
 }

 _deleteAllElements(cb){
   console.log("WARNING: The metadata database has been dropped and is being recreated...")
   Element.search("tag:element").delete()
   cb.call(this);
 }

 _doSaveElements(elements, isDBEmpty, cb){
   let self = this;
   //let db = this.db;

   console.log("Writing to database...")
   var db = this.db;

   //db.serialize(function() {
     /*
     db.run("CREATE TABLE IF NOT EXISTS elements (id INTEGER PRIMARY KEY, name TEXT collate nocase, layer INTEGER, type TEXT collate nocase, content TEXT, UNIQUE(name, layer, type))");
     var stmt = db.prepare("INSERT OR REPLACE INTO elements(id, name, layer, type, content) VALUES ((SELECT Id FROM elements WHERE name = $1 AND layer = $2 AND type = $3), $1, $2, $3, $4)");
     */

     console.log("Writing " + elements.length + " elements...")
     var numLeft = elements.length
     for(let i = 0; i < elements.length; i++){
       let e = elements[i]
       e.layer = 0;
       //console.log("writing element: " + e.name + ", " + e.layer + ", " + e.type)
       //stmt.run(e.name, e.layer, e.type, JSON.stringify(e));
       new Element(i, e.type, e.name, e.layer, JSON.stringify(e))
     }

     //stmt.finalize();
   //})
   cb();
 }

 getElementByData(data, cb){
   if(!isNaN(data.id))
     this.getElementById(data.id, cb)
   else
     this.getElementByNameAndType(data.name, data.type, cb)
 }

 getElementById(id, cb){
   /*
   this.db.get("SELECT id, name, layer, type, content from elements where id = ?", id, function(err, row){
    cb(row)
   })
   */
  cb(Element.find("tag:element prop:id="+id).toObj())
 }

 getElementByNameAndType(name, type, cb){
   /*
   this.db.get("SELECT id, name, layer, type, content from elements where name = ? AND type = ? ", name, type, function(err, row){
    cb(row)
   })
   */
  cb(Element.find(`tag:element prop:name=${name} prop:type=${type}`).toObj())
 }

 getJSSource(id, cb){
   /*
   this.db.get("SELECT content from elements where id = ?", id, function(err, row){
    cb(JSON.parse(row.content).jsSource);
   })
   */
  cb(Element.find("tag:element prop:id="+id).content)
 }

 getElementList(type, cb){
   if(type != null){
     /*
     this.db.all("SELECT id, name, layer, type from elements where type = ?", type, function(err, rows){
      cb(rows);
     })
     */
    cb(Element.search("tag:element prop:type="+type).map(e => e.toObj(true)))
   } else {
     /*
     this.db.all("SELECT id, name, layer, type from elements", function(err, rows){
      cb(rows);
     })
     */
    cb(Element.search("tag:element").map(e => e.toObj(true)))
   }
 }

 getElementsInList(elementNameArray, options, cb){ //Sample options: {include: ["basic", "jsSource"]}
  //var self = this;

  if(elementNameArray === undefined || elementNameArray == null || elementNameArray == "")
    return [];

  /*
  this.db.all("SELECT id, name, layer, type, content from elements where name IN ('" + elementNameArray.join("\', \'") + "')", function(err, rows){
    var res = [];
    for(let e in rows){
      let resElement = self.getObjectBasedOnOptions(rows[e], options);
      res.push(resElement);
    }
    cb(res);
  })
  */
  let res = Element.search("tag:element").filter(e => elementNameArray.includes(e.name))
  cb(res.map(e => this.getObjectBasedOnOptions(e.toObj(), options)))
 }

 getObjectBasedOnOptions(element, options){
   var ret = {}
   var parsedContent = null;
   if(options.include.indexOf("basic") >= 0){
     ret.id = element.id;
     ret.name = element.name;
     ret.layer = element.layer;
     ret.type = element.type;
   }

   if(options.include.indexOf("jsSource") >= 0){
     parsedContent = parsedContent == null ? JSON.parse(element.content) : parsedContent;
     ret.jsSource = parsedContent.jsSource;
   }

   //TODO: finish
   return ret;
 }

 compileElement(dbElement, cb){
   let self = this;
   let element = JSON.parse(dbElement.content);
   let elements = [element]
   let compiler = new XPPCompiler(elements);
   console.log("Compiling " + element.name)
 	 compiler.compile(function(){

     //console.log(element.jsSource)
     //console.log([element.name, element.layer, element.type, JSON.stringify(element), dbElement.id]);
     /*
     self.db.run("UPDATE elements SET name = ?, layer = ?, type = ?, content = ? WHERE id = ?",
                        element.name, element.layer, element.type, JSON.stringify(element), dbElement.id, function(err){
          if(err)
            console.log(err)
          cb({success: err ? false : true, error: err});
      });
    */

    Element.find("prop:id="+dbElement.id)
              .prop("name", element.name)
              .prop("layer", element.layer)
              .prop("type", element.type)
              .prop("content", JSON.stringify(element))
              .tag("element")
    cb({success: true});
   })
 }
}

module.exports = MetadataHandler;
