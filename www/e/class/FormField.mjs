import FormControl from "./FormControl.mjs"
import MenuFunction from "./MenuFunction.mjs";
import Args from "./Args.mjs"

export default class FormField extends FormControl{
  initFromMeta(meta){
    super.initFromMeta(meta)
    this.label(meta.label || meta.text || meta.children.type?.[0].label || meta.children.tableField?.[0].label || meta.children.tableField?.[0]?.children?.type?.[0]?.label || "")
    this.dataField(meta.dataField)

    this.pJumpRef = meta.children?.jumpRef?.[0]
  }

  label(label = this.properties.label){
    return (this.properties.label = label) || super.name()
  }

  dataField(dataField = this.properties.dataField){
    return this.properties.dataField = dataField;
  }

  dataSource(dataSource = this.properties.dataSource){
    return this.properties.dataSource = dataSource
  }

  record2StrValue(record){
    return record?.[this.dataField()] || ""
  }

  jumpRef(){
    if(!this.pJumpRef) return;
    let args = new Args()
    let fds = this.owner().dataSource(this.dataSource())
    args.dataset(fds.table())
    args.record(fds.cursor())
    new MenuFunction(this.pJumpRef.name).run(args);
  }

  hasJumpRef(){
    return this.pJumpRef ? true : false
  }

  // Called when a user modified value. Not AX method. Purpose is to register the new value, to use when calling eg. write/insert
  userModifiedValue(){
    this.modified()
  }

  modified(){

  }
}