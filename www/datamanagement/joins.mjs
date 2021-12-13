import {getCachedElementById} from "/e/class/Metadata.mjs"
import {tableNum} from "/e/class/Global.mjs"

export function attemptJoinRecordAndQBDS(parentTableId, record, qbds){
  qbds.clearRanges()
  let childMeta = getCachedElementById(qbds.table())
  if(!childMeta) return;

  for(let r of childMeta.children.reverserelation||[]){
    if(r.tableId != parentTableId) continue

    for(let c of r.children.constraint||[]){
      qbds.addRange(c.relatedField).value(record[c.field])
      //console.log(`${childMeta.name}.${c.relatedField} == ${record[c.field]}`)
    }
  }

  for(let r of childMeta.children.relation||[]){
    let tabName = r.relatedTable
    let tabId = tableNum(tabName)
    if(tabId != parentTableId) continue

    for(let c of r.children.constraint||[]){
      let qbr = qbds.addRange(c.field)
      qbr.value(record[c.relatedField])
      //console.log(`${childMeta.name}.${c.field} == ${record[c.relatedField]}`)
    }
  }
}

export function addAutoLinks(parent, child){
  //console.log(`checking ${parent.name()} and ${child.name()}`)
  let childMeta = getCachedElementById(child.table())
  
  for(let r of childMeta?.children.reverserelation||[]){
    if(r.tableId != parent.table()) continue

    for(let c of r.children.constraint||[]){
      child.addLink(c.field, c.relatedField)
      //console.log(`JOIN ${tableName}.${c.field} <-> ${childMeta.name}.${c.relatedField}`)
    }
    return; // Only use one relation per table
  }

  for(let r of childMeta?.children.relation||[]){
    let tabName = r.relatedTable
    let tabId = tableNum(tabName)
    if(tabId != parent.table()) continue

    for(let c of r.children.constraint||[]){
      child.addLink(c.relatedField, c.field)
      //console.log(`JOIN ${tabName}.${c.field} <-> ${childMeta.name}.${c.relatedField}`)
    }
    return; // Only use one relation per table
  }
}