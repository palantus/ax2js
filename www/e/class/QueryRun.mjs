import {getTableData} from "../../datamanagement/data.mjs"
import {tableId2Name} from "./Global.mjs"
import {runQuery} from "../../datamanagement/queryRunner.mjs"

export default class QueryRun{
  constructor(query){
    this.pQuery = query
  }

  query(q = this.pQuery){
    return this.pQuery = q;
  }

  async fetchData(){
    if(this.data) return;
    this.data = runQuery(this.pQuery)
  }

  async fetchDataRunDS(qbds){

  }

  async run(){

  }

  async next(){
    await this.fetchData()

    this.curIdx = (this.curIdx || -1) + 1
    return this.curIdx < this.data.length - 1
  }

  get(tabId){
    return this.data[this.curIdx][tableId2Name(tabId)]
  }

  getNo(idx){
    return this.data[this.curIdx][Object.keys(this.data[this.curIdx])[0]]
  }

  async prompt(){

  }
}