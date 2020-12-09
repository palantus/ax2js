import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertTable(table, metadata) {
  table.tag("table")

  storeProperties(table, metadata)

  let fields = getArray(metadata.Fields?.AxTableField)

  for(let field of fields){
    let f = new Entity().tag("tablefield").rel(table, "element")
    table.rel(f, "field")

    storeProperties(f, field)
  }
}

export function expandTableField(e){
  let ext;
  if(e.extendedDataType){
    ext = Entity.find(`tag:edt prop:name=${e.extendedDataType}`)
    if(!ext){
      console.log(`Field ${e.name} uses datatype ${e.extendedDataType}, which doesn't exist`)
      return;
    }
  } else if(e.enumType){
    ext = Entity.find(`tag:enum prop:name=${e.enumType}`)
    if(!ext){
      console.log(`Field ${e.name} uses datatype ${e.enumType}, which doesn't exist`)
      return;
    }
  }

  if(ext){
    e.rel(ext, "type")
  }
}