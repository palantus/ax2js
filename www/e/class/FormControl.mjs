export default class FormControl{
  constructor(name){
    this.pName = name;
  }

  async init(){
    this.onNewData = this.onNewData.bind(this)
    this.form().on("fds-data-available", this.pName, this.onNewData)
  }

  design(design){
    if(design){
      this._design = design;
      this._form = design.form();
    }
    return this._design;
  }

  form(form){
    if(form)
      this._form = form;
    return this._form;
  }

  initFromMeta(meta){
    
  }

  onActiveRecord(){

  }

  onNewData(data){

  }
}