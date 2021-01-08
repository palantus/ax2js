import {insertRecord} from "../../datamanagement/data.mjs"

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

  }
}