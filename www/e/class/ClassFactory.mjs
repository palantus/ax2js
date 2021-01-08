import FormRun from "/e/class/FormRun.mjs"

class ClassFactory{
  static async formRunClass(args){
    return ClassFactory.formRunClassOnClient(args)
  }

  static async formRunClassOnClient(args){
    try{
    if(args.name())
      return new ((await import(`/api/meta/form/${args.name()}.mjs`)).default)(args)
    } catch(err){
      console.log(err)
      console.log("Could not load form code")
    }
    return new FormRun(args)
  }
}

export default ClassFactory;