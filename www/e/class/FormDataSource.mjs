import {tableNum} from "./Global.mjs"
import QueryRun from "./QueryRun.mjs";
import Query from "./Query.mjs";

export default class FormDataSource{

  constructor(){
    this.pCursor = null;
    this.pName = "";
    this.pQuery = null
    this.pQueryRun = null
    this.eventHandlers = {}
  }

  async init(){ //Called at runtime
    // Load fields?

    this.pQuery = new Query();
    this.pQuery.addDataSource(this.table())

    this.executeQuery() // Should only be called if property AutoQuery = Yes
  }

  initFromMeta(meta){ // Called when added to form
    this.name(meta.name)
    this.table(tableNum(meta.table))
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
}