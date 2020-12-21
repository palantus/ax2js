import {elements} from "./Metadata.mjs"

export function formStr(formName){
  return formName
}

export function enumNum(){
  return 0;
}

export function tableNum(name){
  return elements.find(e => e.type == "table" && e.name == name)?.id
}

export function tableId2Name(tabId){
  return elements.find(e => e.id == tabId)?.name
}

export function fieldId2Name(irrelevantTableId, fieldId){
  return elements.find(e => e.id == fieldId)?.name || ""
}