import QueryBuildRange from "./QueryBuildRange.mjs";

export default class QueryBuildDataSource{
  constructor(){
    this.dataSources = []
    this.ranges = []
    this.tabId = 0;
  }

  addDataSource(tabId){
    let qbds = new QueryBuildDataSource();
    qbds.table(tabId)
    this.dataSources.push(qbds);
  }

  addRange(fieldId){
    let range = new QueryBuildRange();
    range.table(this.tabId)
    range.field(fieldId)
    this.ranges.push(range)
    return range;
  }

  table(tabId){
    if(tabId)
      this.tabId = tabId;
    return this.tabId;
  }
}