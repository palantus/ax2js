import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertClass(cls, metadata) {
  cls.tag("class")

  storeProperties(cls, metadata)
  addSubItemsToClass(cls, metadata)
}

export function convertClassExtension(clsExt, metadata) {
  clsExt.tag("classext")

  storeProperties(clsExt, metadata)

  let className = clsExt.name.substring(0, clsExt.name.lastIndexOf("."))
  let cls = Entity.find(`tag:class prop:name=${className}`)

  if(!cls){
    console.log(`Class extension ${clsExt.name} extends class ${className} which doesn't exist`)
    return
  }

  addSubItemsToClass(cls, metadata)
}

function addSubItemsToClass(cls, metadata){
  let decl = metadata.SourceCode.Declaration || ""
  cls.rel(new Entity().tag("classdeclaration").prop("sourceXPP", decl).rel(cls, "element"), "declaration")

  let methods = getArray(metadata.SourceCode?.Methods?.Method)
  for(let method of methods){
    cls.rel(new Entity().tag("classfunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(cls, "element"), "function")
  }
}
