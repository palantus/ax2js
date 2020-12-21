import {getCachedElementById} from "/e/class/Metadata.mjs"

export function attemptJoinRecordAndQBDS(record, qbds){
  let table = getCachedElementById(qbds.table())

  console.log(table, record, qbds)
}

export function addAutoLinks(parent, child){
  let childMeta = getCachedElementById(child.table())
  
  for(let r of childMeta.children.reverserelation||[]){
    if(r.tableId != parent.table()) continue

    console.log(`JOIN ${r.tableName} <-> ${childMeta.name}`)
  }

  //console.log(childMeta)
}