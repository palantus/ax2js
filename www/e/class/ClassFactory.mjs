import FormRun from "/e/class/FormRun.mjs"
import SysSetupFormRun from "./SysSetupFormRun.mjs";

class ClassFactory{
  static formRunClass(args){
    return this.formRunClassOnClient(args)
  }

  static formRunClassOnClient(args){
    return new SysSetupFormRun(args)
  }
}

export default ClassFactory;