export default class FormDataSource{

  constructor(){
    this.pCursor = null;
    this.pName = "";
  }

  query(query){
    if(query)
      this.q = query;
    return this.q;
  }

  queryRun(queryRun){
    if(queryRun)
      this.qr = queryRun;
    return this.qr;
  }

  cursor(){
    return this.pCursor;
  }

  name(name){
    if(name)
      this.pName = name;
    return this.pName;
  }

  executeQuery(){
    
  }

  getFirst(){

  }
}