import {insertRecord, updateRecord} from "../../datamanagement/data.mjs"

export default class Common{
  _hasValue(){
    return this.RecId ? true : false;
  }

  clear(){
    this.RecId = 0
  }

  initValue(){

  }

  insert(){
    insertRecord(this)
  }

  write(){

  }

  update(){
    updateRecord(this)
  }

  isTmp(){
    
  }

  setTmp(){

  }

  data(data){

  }

  clear(){
    
  }
}