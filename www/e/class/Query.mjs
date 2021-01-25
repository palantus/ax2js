import QueryBuildDataSource from "./QueryBuildDataSource.mjs"
import {tableId2Name} from "./Global.mjs"

export default class Query{
  constructor(){
    this.dataSources = []
  }

  addDataSource(tabId, name = tableId2Name(tabId) || `table_${tabId}`){
    let qbds = new QueryBuildDataSource(name);
    qbds.table(tabId)
    this.dataSources.push(qbds);
    return qbds;
  }

  dataSourceNo(idx){
    return this.dataSources[idx-1]
  }

  dataSourceName(name){
    for(let ds of this.dataSources){
      if(ds.name() == name)
        return ds;
      let dsChild = ds.findChildDSByName(name)
      if(dsChild)
        return dsChild
    }

    return null;
  }

  dataSourceTable(id){
    for(let ds of this.dataSources){
      if(ds.table() == id)
        return ds;
      let dsChild = ds.findChildDSByTableId(id)
      if(dsChild)
        return dsChild
    }

    return null;
  }

  pack(){

  }

  unpack(){

  }
}