import {getTableData} from "./data.mjs"
import {tableId2Name} from "../e/class/Global.mjs"
import JoinMode from "/e/enum/JoinMode.mjs"

export function runQuery (q) {
  let result = []

  let qbds = q.dataSourceNo(1)
  let qbdsName = qbds.name()
  let tabName = tableId2Name(qbds.table())
  let tableData = getTableData(tabName)
  result = tableData.map(r => {
    let newRecord = {}
    newRecord[qbdsName] = r
    return newRecord
  })

  for(let ds of qbds.dataSources){
    joinQBDS(result, tabName, ds)
  }

  return result;
}

function joinQBDS(result, parentQbdsName, child){
  let tabName = tableId2Name(child.table())
  let tableData = getTableData(tabName)
  let qbdsName = child.name()

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
    joinQBDS(result, qbdsName, ds)
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