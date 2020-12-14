import FormControl from "./FormControl.mjs"

export default class FormField extends FormControl{
  initFromMeta(meta){
    this.label(meta.label || meta.text || meta.children.tableField?.[0].label || meta.children.tableField?.[0]?.children?.type?.[0]?.label)
    this.dataField(meta.dataField)
  }

  label(label = this.pLabel){
    return (this.pLabel = label) || super.name()
  }

  dataField(dataField = this.pDataField){
    return this.pDataField = dataField;
  }

  record2StrValue(record){
    return record?.[this.pDataField] || ""
  }
}