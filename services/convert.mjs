import Entity from "entitystorage"
import {convertForm, expandFormControl} from "./convert/form.mjs"
import {convertEDT, expandEDT} from "./convert/edt.mjs"
import {convertEnum} from "./convert/enum.mjs"
import {convertTable, expandTableField, convertTableExtension, mergeTableExtension} from "./convert/table.mjs"
import {convertMenuItem, expandMenuFunctionButton} from "./convert/menuitem.mjs"
import {convertMenu, mergeMenuExtension, expandMenuSubItem, convertMenuExtension, expandMenuSubRef} from "./convert/menu.mjs"

export function convert(entity, metadata){

  switch(entity.type){
    case "form":
      //entity.prop("metadata", metadata);
      return convertForm(entity, metadata)
    case "edt":
      //entity.prop("metadata", metadata);
      return convertEDT(entity, metadata)
    case "enum":
      //entity.prop("metadata", metadata);
      return convertEnum(entity, metadata)
    case "table":
      return convertTable(entity, metadata)
    case "tableextension":
      return convertTableExtension(entity, metadata)
    case "menuitemdisplay":
    case "menuitemaction":
    case "menuitemoutput":
      return convertMenuItem(entity, metadata)
    case "menu":
      return convertMenu(entity, metadata)
    case "menuextension":
      return convertMenuExtension(entity, metadata)
    default:
      entity.prop("metadata", metadata);
  }
}

export function expandAllElements(){
  Entity.search("tag:edt !prop:extends=").map(e => expandEDT(e))
  Entity.search("tag:tablefield").map(e => expandTableField(e))
  Entity.search("tag:formcontrol").map(e => expandFormControl(e))
  Entity.search("tag:formcontrol prop:type=MenuFunctionButton").map(e => expandMenuFunctionButton(e))
  Entity.search("tag:menusubitem").map(e => expandMenuSubItem(e))
  Entity.search("tag:menusubref").map(e => expandMenuSubRef(e))
}

export function mergeExtensions(){
  Entity.search("tag:menuext").map(e => mergeMenuExtension(e))
  Entity.search("tag:tableext").map(e => mergeTableExtension(e))
}