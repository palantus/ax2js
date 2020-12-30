import Entity from "entitystorage"
import {convertForm, expandFormControl, convertFormExtension, mergeFormExtension, expandFDS, updateFormFieldJumpAndLookup, createMissingFormControlsInGroup} from "./convert/form.mjs"
import {convertEDT, expandEDT} from "./convert/edt.mjs"
import {convertEnum} from "./convert/enum.mjs"
import {convertTable, expandTableField, convertTableExtension, updateTableReferences} from "./convert/table.mjs"
import {convertMenuItem, expandMenuFunctionButton} from "./convert/menuitem.mjs"
import {convertMenu, mergeMenuExtension, expandMenuSubItem, convertMenuExtension, expandMenuSubRef} from "./convert/menu.mjs"
import {convertClass, convertClassExtension} from "./convert/class.mjs"

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
    case "formextension":
      return convertFormExtension(entity, metadata)
    case "class":
      return convertClass(entity, metadata)
    case "classextension":
      return convertClassExtension(entity, metadata)
    default:
      entity.prop("metadata", metadata);
  }
}

export function expandAllElements(){
  Entity.search("tag:edt !prop:extends=").forEach(e => expandEDT(e))
  Entity.search("tag:tablefield").forEach(e => expandTableField(e))
  Entity.search("tag:formcontrol").forEach(e => expandFormControl(e))
  Entity.search("tag:formcontrol prop:type=MenuFunctionButton").forEach(e => expandMenuFunctionButton(e))
  Entity.search("tag:menusubitem").forEach(e => expandMenuSubItem(e))
  Entity.search("tag:menusubref").forEach(e => expandMenuSubRef(e))
  Entity.search("tag:fds").forEach(e => expandFDS(e))
  Entity.search("tag:formcontrol (prop:type=Grid|prop:type=Group) !prop:dataField=").forEach(e => createMissingFormControlsInGroup(e))
}

export function mergeExtensions(){
  Entity.search("tag:menuext").forEach(e => mergeMenuExtension(e))
  Entity.search("tag:formext").forEach(e => mergeFormExtension(e))
}

export function updateReferences(){
  Entity.search("tag:table").forEach(e => updateTableReferences(e))
  Entity.search("tag:formcontrol").forEach(e => updateFormFieldJumpAndLookup(e))
}