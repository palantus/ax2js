import {getCachedElementById} from "/e/class/Metadata.mjs"
import {tableNum} from "/e/class/Global.mjs"

export function attemptJoinRecordAndQBDS(record, qbds){
  let table = getCachedElementById(qbds.table())

  console.log(table, record, qbds)
}

export function addAutoLinks(parent, child){
  //console.log(`checking ${parent.name()} and ${child.name()}`)
  let childMeta = getCachedElementById(child.table())
  
  for(let r of childMeta.children.reverserelation||[]){
    if(r.tableId != parent.table()) continue

    for(let c of r.children.constraint||[]){
      child.addLink(c.field, c.relatedField)
      //console.log(`JOIN ${tableName}.${c.field} <-> ${childMeta.name}.${c.relatedField}`)
    }
  }

  for(let r of childMeta.children.relation||[]){
    let tabName = r.relatedTable
    let tabId = tableNum(tabName)
    if(tabId != parent.table()) continue

    for(let c of r.children.constraint||[]){
      child.addLink(c.relatedField, c.field)
      //console.log(`JOIN ${tabName}.${c.field} <-> ${childMeta.name}.${c.relatedField}`)
    }
  }
}