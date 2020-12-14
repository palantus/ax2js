import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertMenuItem(enumeration, metadata) {
  enumeration.tag("menuitem")

  storeProperties(enumeration, metadata)
}

export function expandMenuFunctionButton(e){
  let ext;

  if(!e.menuItemName) return;
  let type;
  switch(e.menuItemType){
    case "Output": type = "menuitemoutput"; break;
    case "Action": type = "menuitemaction"; break;
    default:       type = "menuitemdisplay"; break;
  }

  ext = Entity.find(`tag:menuitem prop:name=${e.menuItemName} prop:type=${type}`)
  if(!ext){
    console.log(`Menu item control ${e.name} of form ${e.parentElementId} uses MI ${e.menuItemName}, which doesn't exist`)
    return;
  }

  e.rel(ext, "menuItem")
}