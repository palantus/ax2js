export default class FormControl{
  constructor(name){
    this.pName = name;
    this.onNewData = this.onNewData.bind(this)
    this.onActiveRecord = this.onActiveRecord.bind(this)
    this.properties = {}
  }

  init(){
    this.form().dataSource(this.properties?.dataSource)?.on("data-available", this.pName, this.onNewData)
    this.form().dataSource(this.properties?.dataSource)?.on("active", this.pName, this.onActiveRecord)
  }

  name(name = this.pName){
    return this.pName = name;
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
    for(let p in meta)
      if(typeof meta[p] === "string")
        this.properties[p] = meta[p]
  }

  onActiveRecord(record){
  }

  onNewData(data){
  }

  render(){
    if(this.properties.visible == "No")
      this.siteElement.style.display = "none"
  }
}