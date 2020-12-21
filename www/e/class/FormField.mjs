import FormControl from "./FormControl.mjs"

export default class FormField extends FormControl{
  initFromMeta(meta){
    super.initFromMeta(meta)
    this.label(meta.label || meta.text || meta.children.type?.[0].label || meta.children.tableField?.[0].label || meta.children.tableField?.[0]?.children?.type?.[0]?.label || "")
    this.dataField(meta.dataField)
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
}