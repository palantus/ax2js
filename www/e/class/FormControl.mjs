export default class FormControl{
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
}