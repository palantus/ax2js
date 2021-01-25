import {getTableData} from "./data.mjs"
import {tableId2Name} from "../e/class/Global.mjs"
import JoinMode from "/e/enum/JoinMode.mjs"
import {addAutoLinks} from "./joins.mjs"

export async function runQuery (q) {
  let result = []

  let qbds = q.dataSourceNo(1)
  let qbdsName = qbds.name()
  let tabName = tableId2Name(qbds.table())
  let tableData = await getTableData(tabName)
  result = tableData.map(r => {
    let newRecord = {}
    newRecord[qbdsName] = r
    return newRecord
  })

  for(let range of qbds.ranges){
    let fieldName = range.fieldName()
    let rangeValue = range.value()
    if(rangeValue && rangeValue != "*")
      result = result.filter(r => r[qbdsName][fieldName] == rangeValue || (rangeValue == "---EMPTYSTRING---" && !r[qbdsName][fieldName]))
  }

  for(let ds of qbds.dataSources){
    await joinQBDS(result, tabName, null, ds)
  }

  return result;
}

async function joinQBDS(result, parentQbdsName, parent, child){
  let tabName = tableId2Name(child.table())
  let tableData = await getTableData(tabName)
  let qbdsName = child.name()

  if(parent && child.relations()){
    addAutoLinks(parent, child)
  }

  result.reduceRight(function(acc, record, index, object) {
    let childRecord = findRecordFromLinks(record[parentQbdsName], tableData, child.links)

    switch(child.joinMode()){
      case JoinMode.InnerJoin:
      case "InnerJoin":
      case JoinMode.ExistsJoin:
      case "ExistsJoin":
          if(!childRecord){
            object.splice(index, 1);
            return;
          }
          break;
    }

    record[qbdsName] = childRecord || null
  }, []);

  for(let ds of child.dataSources){
    joinQBDS(result, qbdsName, child, ds)
  }
}

function findRecordFromLinks(parentRecord, data, links){
  return data.filter(r => {
    for(let l of links){
      if(r[l.child] != parentRecord[l.parent])
        return false;
    }
    return true;
  })[0]||null
}

class QueryResult{
  constructor(){
    this.tableData = {}
    this.result = []
  }
}