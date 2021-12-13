export default class FormControl{
  constructor(name){
    this.pName = name;
    this.onNewData = this.onNewData.bind(this)
    this.onActiveRecord = this.onActiveRecord.bind(this)
    this.properties = {}
  }

  init(){
    // Intentional that it is on all controls - even though they don't have a data source. AX defaults to first one!
    this.owner().form().dataSource(this.properties?.dataSource)?.on("data-available", this.pName, this.onNewData)
    this.owner().form().dataSource(this.properties?.dataSource)?.on("active", this.pName, this.onActiveRecord)

    if(this.properties?.autoDeclaration == "Yes" && this.pName){
      this.owner().namedControls[this.pName] = this
    }
  }

  name(name = this.pName){
    return this.pName = name;
  }

  design(design){
    if(design) this.pDesign = design;
    return this.pDesign;
  }

  owner(){
    return this.parent.owner()
  }

  initFromMeta(meta){
    for(let p in meta)
      if(typeof meta[p] === "string")
        this.properties[p] = meta[p]
        
    this.elementId = meta.id
  }

  onActiveRecord(record){
  }

  onNewData(data){
  }

  render(){
    if(this.properties.visible == "No")
      this.siteElement.style.display = "none"

    if(this.elementId)
      this.siteElement?.setAttribute("data-element-id", this.elementId)
  }
}