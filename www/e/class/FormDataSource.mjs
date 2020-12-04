import {tableNum} from "./Global.mjs"
import QueryRun from "./QueryRun.mjs";
import Query from "./Query.mjs";

export default class FormDataSource{

  constructor(){
    this.pCursor = null;
    this.pName = "";
    this.pQuery = null
    this.pQueryRun = null
  }

  async init(){ //Called at runtime
    // Load fields?

    this.pQuery = new Query();
    this.pQuery.addDataSource(this.table())

    this.executeQuery() // Should only be called if property AutoQuery = Yes
  }

  initFromMeta(meta){ // Called when added to form
    this.name(meta.Name)
    this.table(tableNum(meta.Table))
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

  name(name){
    if(name)
      this.pName = name;
    return this.pName;
  }

  async executeQuery(){
    this.pQueryRun = new QueryRun(this.pQuery)
    await this.pQueryRun.next();

    this.form().fire("fds-data-available", this.pQueryRun.data)
  }

  getFirst(){

  }

  form(form = this.pForm){
    return this.pForm = form;
  }
}