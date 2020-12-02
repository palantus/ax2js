export default class QueryBuildRange{
  constructor(){
    this.value = ""
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

  table(fieldId = this.fieldId){
    return this.fieldId = fieldId;
  }
}