class FormRun{
  constructor(args){
    this.args = args
  }

  run(){
    alert("Run: " + this.args.name())
  }

  wait(){
    console.log("stub")
  }
}

export default FormRun