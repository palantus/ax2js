import Entity from "entitystorage"

export default class ClassGenerator{
  constructor(parent, name){
    this.parent = parent
    this.name = name
  }

  addDependencyByName(name){
    let entity = Entity.find(`prop:name=${name} (tag:class|tag:table|tag:edt|tag:enum)`)
    this.parent.rel(entity, "dep")
  }

  addFunction(name, source){

  }

  
}