import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertMenu(menu, metadata) {
  menu.tag("menu")

  storeProperties(menu, metadata)
  getArray(metadata.Elements?.AxMenuElement).filter(m => m.Name != "Workspaces").forEach((m, idx) => parseMenu(menu, m, idx))
}

export function convertMenuExtension(ext, metadata) {
  ext.tag("menuext")

  storeProperties(ext, metadata)
  getArray(metadata.Elements?.AxMenuExtensionElement).filter(m => m.Name != "Workspaces").forEach(m => {
    let extItem = new Entity()
    extItem.tag("menuextitem")
    ext.rel(extItem, "item")
    storeProperties(extItem, m)

    parseMenu(extItem, m.MenuElement)
  })
}

function parseMenu(parent, meta, idx = 0) {
  let cur = new Entity()
  cur.positionIdx = idx
  parent.rel(cur, "item")
  storeProperties(cur, meta)

  if(meta.Elements !== undefined){
    cur.type = "submenu"
    cur.tag("submenu")
    getArray(meta.Elements?.AxMenuElement).forEach((m, idx) => parseMenu(cur, m, idx))
  } else if(meta.MenuName){
    cur.type = "menuref"
    cur.tag("menusubref")
  } else {
    cur.type = "item"
    cur.tag("menusubitem")
  }
}

export function expandMenuSubItem(subI){
  if(!subI.menuItemName) return;
  let typeName = "menuitemdisplay"
  switch(subI.menuItemType){
    case "Action":
      typeName = "menuitemaction";
      break;
    case "Output":
      typeName = "menuitemoutput";
      break;
  }
  let mi = Entity.find(`tag:menuitem prop:name=${subI.menuItemName} prop:type=${typeName}`)
  if(mi){
    subI.rel(mi, "menuitem")
    subI.label = subI.label || mi.label
  }
}

export function expandMenuSubRef(ref){
  if(!ref.menuName) return;
  let menu = Entity.find(`tag:menu prop:name=${ref.menuName}`)
  if(menu){
    ref.rel(menu, "menu")
  }
}

export function mergeMenuExtension(ext){
  let menuName = ext.name.substring(0, ext.name.lastIndexOf("."))
  let menu = Entity.find(`tag:menu prop:name=${menuName}`)
  if(!menu){
    console.log(`Menu extension ${ext.name} extends a menu which doesn't exist`)
    return;
  }

  ext.rels.item.forEach((item, idx) => {
    let parent = item.parent ? findItemByName(menu, item.parent) : null;
    let previousSibling = item.previousSibling ? findItemByName(menu, item.previousSibling) : null;
    
    if(!parent){
      parent = previousSibling?.relsrev?.item[0] || menu
    }

    parent.rel(item.related.item, "item")

    switch(item.positionType){
      case "AfterItem":
        if(!previousSibling)
          throw "previousSibling is missing"
        item.related.item.positionIdx = previousSibling.positionIdx+(idx/100+0.01)
        break;
      case "Begin":
        item.related.item.positionIdx = (-100)+idx
        break;
      default:
        item.related.item.positionIdx = 1000+idx
    }
  })
}

function findItemByName(parent, name){
  if(parent.name == name)
    return parent
  //for(let child of parent.rels.item||[]){
    return (parent.rels.item||[]).map(e => findItemByName(e, name)).filter(e => e ? true:false)[0]||null
  //}
}