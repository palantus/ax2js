import Entity from "entitystorage"

export default class ClassGenerator{
  constructor(parent, name){
    this.parent = parent
    this.name = name
    this.functions = []
  }

  addDependencyByName(name){
    let entity = Entity.find(`prop:name=${name} (tag:class|tag:table|tag:edt|tag:enum)`)
    this.parent.rel(entity, "dep")
  }

  addFunction(name, source, parms, isStatic){
    this.functions.push({name, source, isStatic, parms})
  }

  generate(){
    return `class ${this.name}{${
        this.functions.map(f => 
          `\n  ${f.isStatic ? "static " : ""}${f.name}(${f.parms}) {\n    ${f.source}\n  }\n`
        ).join("\n\n")
      }}`
  }
}