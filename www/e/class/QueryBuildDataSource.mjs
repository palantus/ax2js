import QueryBuildRange from "./QueryBuildRange.mjs";

export default class QueryBuildDataSource{
  constructor(name){
    this.dataSources = []
    this.ranges = []
    this.tabId = 0;
    this.pName = name
  }

  addDataSource(tabId, name){
    let qbds = new QueryBuildDataSource(name);
    qbds.table(tabId)
    this.dataSources.push(qbds);
    return qbds
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

  name(){
    return this.pName
  }

  findChildDSByName(name){
    for(let ds of this.dataSources){
      if(ds.name() == name)
        return ds

      let childDS = ds.findChildDSByName()
      if(childDS)
        return childDS
    }
    return null
  }
}