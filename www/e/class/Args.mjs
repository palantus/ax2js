class Args{

  dataset(tableId){
    if(tableId) this.pTableId = tableId;
    return this.pTableId || 0;
  }

  record(record){
    if(record){
      this.pRecord = record
      this.dataset(record.TableId)
    }
    return this.pRecord || null
  }

  formViewOption(option = this.fvo){
    this.fvo = option
    return this.fvo;
  }

  name(name = this.nameVal){
    this.nameVal = name;
    return name;
  }

  caller(){

  }

  parmObject(){
    
  }
}

export default Args