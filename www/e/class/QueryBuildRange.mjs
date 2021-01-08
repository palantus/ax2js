import {fieldNum, fieldId2Name, tableId2Name} from './Global.mjs'

export default class QueryBuildRange{
  constructor(){
    this.pValue = ""
    this.tabId = 0;
    this.fieldId = 0;
  }

  value(val){
    this.val = val;
    return this.val;
  }

  table(tabId = this.tabId){
    return this.tabId = tabId;
  }

  field(fieldId = this.fieldId){
    if(fieldId){
      this.pFieldName = fieldId2Name(null, fieldId)
      this.fieldId = fieldId;
    }
    return this.fieldId
  }

  fieldName(fieldName = this.pFieldName){
    if(fieldName){
      this.fieldId = fieldNum(tableId2Name(this.tabId), fieldName)
      this.pFieldName = fieldName;  
    }
    return this.pFieldName
  }

  value(value = this.pValue){
    return this.pValue = value
  }
}