import {tableNum} from "./Global.mjs"
import QueryRun from "./QueryRun.mjs";
import Query from "./Query.mjs";
import {attemptJoinRecordAndQBDS, addAutoLinks} from "../../datamanagement/joins.mjs"

export default class FormDataSource{

  constructor(){
    this.pCursor = null;
    this.pName = "";
    this.pQuery = null
    this.pQueryRun = null
    this.eventHandlers = {}
  }

  async init(){
    let qbds
    if(this.joinSource()){
      this.pParentFDS = this.owner().dataSource(this.joinSource())
      this.pQuery = this.pParentFDS.query()
      let parentQbds = this.pQuery.dataSourceName(this.joinSource())
      qbds = parentQbds.addDataSource(this.table(), this.name())
      
      addAutoLinks(parentQbds, qbds)
    } else {
      this.pQuery = new Query();
      qbds = this.pQuery.addDataSource(this.table(), this.name())
      attemptJoinRecordAndQBDS(this.owner().args().record(), qbds)
    }

    await Promise.all(this.owner().dataSources().filter(ds => ds.joinSource() == this.name()).map(ds => ds.init()))
  }

  initFromMeta(meta){
    this.name(meta.name)
    this.table(tableNum(meta.table))
    this.joinSource(meta.joinSource||"")
  }

  table(tabId = this.pTabId){
    return this.pTabId = tabId
  }

  query(query = this.pQuery){
    return this.pQuery = query
  }

  queryRun(queryRun = this.pQueryRun){
    return this.pQueryRun = queryRun
  }

  cursor(){
    return this.pCursor;
  }

  active(){

  }

  name(name){
    if(name)
      this.pName = name;
    return this.pName;
  }

  async executeQuery(){
    this.pQueryRun = new QueryRun(this.pQuery)
    await this.pQueryRun.next();

    this.fire("data-available", this.pQueryRun.data)
    this.fire("active", this.pQueryRun.data[0] || null)

    this.active();
  }

  getFirst(){
    return this.pQueryRun.data[0] || null
  }

  form(form = this.pForm){
    return this.pForm = form;
  }

  findIndex(idx){
    this.fire("active", this.pQueryRun.data[idx-1] || null)
  }

  on(eventName, id, fn){
    if(this.eventHandlers[eventName] === undefined)
      this.eventHandlers[eventName] = []

    this.eventHandlers[eventName].push({fn, id})
  }

  off(eventName, id){
    if(this.eventHandlers[eventName] === undefined)
      return;

    this.eventHandlers[eventName] = handlers[eventName].filter(h => h.id != id)
  }

  fire(eventName, data){
    if(this.eventHandlers[eventName] === undefined)
      return;

    this.eventHandlers[eventName].forEach(h => h.fn(data))
  }

  owner(){
    return this.parent.owner()
  }

  joinSource(joinSource = this.pJoinSource){
    return this.pJoinSource = joinSource
  }
}