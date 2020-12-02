import QueryBuildDataSource from "./QueryBuildDataSource.mjs"

export default class Query{
  constructor(){
    this.dataSources = []
  }

  addDataSource(tabId){
    let qbds = new QueryBuildDataSource();
    qbds.table(tabId)
    this.dataSources.push(qbds);
  }

  dataSourceNo(idx){
    return this.dataSources[idx-1]
  }

  pack(){

  }

  unpack(){

  }
}