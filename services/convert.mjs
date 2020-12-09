import Entity from "entitystorage"
import {convertForm, expandFormControl} from "./convert/form.mjs"
import {convertEDT, expandEDT} from "./convert/edt.mjs"
import {convertEnum} from "./convert/enum.mjs"
import {convertTable, expandTableField} from "./convert/table.mjs"

export function convert(entity, metadata){

  switch(entity.type){
    case "form":
      entity.prop("metadata", metadata);
      return convertForm(entity, metadata)
    case "edt":
      //entity.prop("metadata", metadata);
      return convertEDT(entity, metadata)
    case "enum":
      //entity.prop("metadata", metadata);
      return convertEnum(entity, metadata)
    case "table":
      entity.prop("metadata", metadata);
      return convertTable(entity, metadata)
    default:
      entity.prop("metadata", metadata);
  }
}

export function expandAllElements(){
  Entity.search("tag:edt !prop:extends=").map(e => expandEDT(e))
  Entity.search("tag:tablefield").map(e => expandTableField(e))
  Entity.search("tag:formcontrol").map(e => expandFormControl(e))
}