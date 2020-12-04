import {tableNum} from "./Global.mjs"

export default class FormDataSource{

  constructor(){
    this.pCursor = null;
    this.pName = "";
  }

  async init(){ //Called at runtime
    // Load fields?
  }

  initFromMeta(meta){ // Called when added to form
    this.name(meta.Name)
    this.table(tableNum(meta.Table))
  }

  table(tabId = this.pTabId){
    return this.pTabId = tabId
  }

  query(query){
    if(query)
      this.q = query;
    return this.q;
  }

  queryRun(queryRun){
    if(queryRun)
      this.qr = queryRun;
    return this.qr;
  }

  cursor(){
    return this.pCursor;
  }

  name(name){
    if(name)
      this.pName = name;
    return this.pName;
  }

  executeQuery(){
    
  }

  getFirst(){

  }
}