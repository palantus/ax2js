class FormRun{
  constructor(args){
    this.args = args
  }

  init(){

   this.form = new Form();
   let formBuildDesign = form.addDesign('design');
   let comboBox = formBuildDesign.addControl(FormControlType.ComboBox,'Enum');
   comboBox.enumType(enumNum(NKDept));
  }

  get form(){
    return this.form
  }

  run(){
    alert("Run: " + this.args.name())
  }

  wait(){
    console.log("stub")
  }
}

export default FormRun