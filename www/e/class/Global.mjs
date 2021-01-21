import {elements} from "./Metadata.mjs"
import {fire} from "../../system/events.mjs"

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

export function fieldNum(tableId, fieldName){
  return elements.find(e => e.type == "tablefield" && e.name == fieldName && e.tableId == tableId)?.id
}

export function info(text){
  console.log(text)
  fire("log", {
    level: "info", 
    message: text
  })
}

export function strFmt(container, ...args){
  let ret = container
  container.match(/\%\d+/g).forEach(v => {ret = ret.replaceAll(v, args[v.substr(1)-1])})
  return ret
}

export function queryValue(val){
  return val
}

export function dateMax(){
  return 9999999
}

export function dateMin(){
  return 0
}

export function conNull(){
  return []
}

export function conLen(con){
  return con?.length||0
}

export function conPeek(con, idx){
  return con?.[idx-1]||null
}

export function queryRange(from, to){
  return {type: "range", from, to}
}