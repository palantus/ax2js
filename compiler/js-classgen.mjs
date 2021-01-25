import Entity from "entitystorage"

export default class ClassGenerator{
  constructor(parent, name){
    this.parent = parent
    this.name = name
    this.functions = []
    this.classVars = ""
    this.extendsVal = ""
  }

  addDependencyByName(name){
    let entity = Entity.find(`prop:name=${name} (tag:class|tag:table|tag:edt|tag:enum)`)
    this.parent.rel(entity, "dep")
  }

  addFunction(name, source, parms, isStatic){
    this.functions.push({name, source, isStatic, parms})
  }

  generate(){
    return (this.doExportClassDefault ? "export default " : this.doExportClass ? "export " : "") +
        `class ${this.name}${this.extendsVal?` extends ${this.extendsVal}`:''}{${this.classVars}\n${
        this.functions.map(f => 
          `${f.isStatic ? "static " : ""}async ${f.name}(${f.parms}) {\n    ${f.source}\n  }\n`
        ).join("\n")
      }}`
  }

  setExtends(extendsVal){
    this.extendsVal = extendsVal
  }

  addClassVars(classVars){
    this.classVars = classVars
  }

  exportClass(){
    this.doExportClass = true
  }

  exportClassDefault(){
    this.doExportClassDefault = true
  }
}