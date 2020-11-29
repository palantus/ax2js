import FormRun from "/e/class/FormRun.mjs"

class ClassFactory{
  static formRunClass(args){
    return ClassFactory.formRunClassOnClient(args)
  }

  static formRunClassOnClient(args){
    return new FormRun(args)
  }
}

export default ClassFactory;