import QueryBuildRange from "./QueryBuildRange.mjs";
import {fieldId2Name, tableId2Name} from "./Global.mjs"

export default class QueryBuildDataSource{
  constructor(name){
    this.dataSources = []
    this.ranges = []
    this.tabId = 0;
    this.pName = name
    this.links = []
  }

  addDataSource(tabId, name = tableId2Name(tabId) || `table_${tabId}`){
    let qbds = new QueryBuildDataSource(name);
    qbds.table(tabId)
    this.dataSources.push(qbds);
    return qbds
  }

  addRange(fieldIdOrName){
    let range = new QueryBuildRange();
    range.table(this.tabId)
    if(typeof fieldIdOrName === "string")
      range.fieldName(fieldIdOrName)
    else
      range.field(fieldIdOrName)
    this.ranges.push(range)
    return range;
  }

  clearRanges(){
    this.ranges = []
  }

  addLink(parentFieldNameOrId, childFieldNameOrId){
    let parent = typeof parentFieldNameOrId === "string" ? parentFieldNameOrId : fieldId2Name(null, parentFieldNameOrId)
    let child = typeof childFieldNameOrId === "string" ? childFieldNameOrId : fieldId2Name(null, childFieldNameOrId)
    this.links.push({parent, child})
  }

  table(tabId){
    if(tabId)
      this.tabId = tabId;
    return this.tabId;
  }

  name(){
    return this.pName
  }

  joinMode(joinMode = this.pJoinMode){
    return this.pJoinMode = joinMode
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

  findChildDSByTableId(id){
    for(let ds of this.dataSources){
      if(ds.table() == id)
        return ds

      let childDS = ds.findChildDSById()
      if(childDS)
        return childDS
    }
    return null
  }

  addSortField(){
    console.log("STUB: addSortField")
  }

  orderMode(){
    console.log("STUB: orderMode")
  }

  relations(enable = this.pRelations || false){
    return this.pRelations = enable
  }

  addSelectionField(){
    console.log("STUB: addSelectionField")
  }
}