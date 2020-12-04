import {elements} from "./Metadata.mjs"

export function formStr(formName){
  return formName
}

export function enumNum(){
  return 0;
}

export function tableNum(name){
  return elements.find(e => e.name == name)?.id
}