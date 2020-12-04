import {getTableData} from "../../system/data.mjs"
import {tableId2Name} from "./Global.mjs"

export default class QueryRun{
  constructor(query){
    this.pQuery = query
  }

  query(q = this.pQuery){
    return this.pQuery = q;
  }

  fetchData(){
    if(this.data) return;
    let ds = this.pQuery.dataSourceNo(1)
    let tabName = tableId2Name(ds.table())
    let data = getTableData(tabName)
    
    //Ranges, sorting etc.

    this.data = data
  }

  async run(){

  }

  next(){
    this.fetchData()

    this.curIdx = (this.curIdx || -1) + 1
    return this.curIdx < this.data.length - 1
  }

  get(tabId){
    return this.data[this.curIdx]
  }

  getNo(idx){
    return this.data[this.curIdx]
  }

  async prompt(){

  }
}