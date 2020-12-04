export default class FormControl{
  constructor(name){
    this.name = name;
  }

  async init(){
    
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
}