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

  async insert(){
    await insertRecord(this)
  }

  write(){

  }

  async update(){
    await updateRecord(this)
  }

  isTmp(){
    
  }

  setTmp(){

  }

  data(data){

  }

  asyncclear(){
    
  }
}