import FormControl from "./FormControl.mjs"

export default class FormField extends FormControl{
  label(label = this.pLabel){
    return (this.pLabel = label) || this.properties.DataField || this.name()
  }
}