class Args{

  dataset(){

  }

  record(){

  }

  formViewOption(option = this.fvo){
    this.fvo = option
    return this.fvo;
  }

  name(name = this.nameVal){
    this.nameVal = name;
    return name;
  }
}

export default Args