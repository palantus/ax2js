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
  let xppSource = metadata.SourceCode.Declaration || ""
  let declElement = new Entity().tag("classdeclaration").rel(cls, "element")
  cls.rel(declElement, "declaration")

  declElement.rel(new Entity().tag("xpp").prop("source", xppSource), "xpp")

  let methods = getArray(metadata.SourceCode?.Methods?.Method)
  for(let method of methods){
    let funcElement = new Entity().tag("classfunction").prop("name", method.Name).rel(cls, "element")
    cls.rel(funcElement, "function")

    funcElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
  }
}
