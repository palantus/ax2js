import {getTableData} from "../../datamanagement/data.mjs"
import {tableId2Name} from "./Global.mjs"
import {runQuery} from "../../datamanagement/queryRunner.mjs"

export default class QueryRun{
  constructor(query){
    this.pQuery = query
    this.curIdx = -1
  }

  query(q = this.pQuery){
    return this.pQuery = q;
  }

  fetchData(){
    if(this.data) return;
    this.data = runQuery(this.pQuery)
  }

  fetchDataRunDS(qbds){

  }

  run(){

  }

  next(){
    this.fetchData()

    this.curIdx++;
    return this.curIdx < this.data.length ? true : false
  }

  get(tabId){
    let ds = this.pQuery.dataSourceTable(tabId)
    return this.data[this.curIdx][ds.name()]
  }

  getNo(idx){
    return this.data[this.curIdx][Object.keys(this.data[this.curIdx])[0]]
  }

  async prompt(){

  }
}