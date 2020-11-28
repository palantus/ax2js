import FormControlType from "../enum/FormControlType.mjs";
import FormComboBoxControl from "./FormComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs";

export default class FormBuildDesign{
  constructor(name){
    this.name = name;
  }

  addControl(type, name){
    switch(type){
      case FormControlType.Enum:
        return new FormComboBoxControl(name)
      case FormControlType.String:
        return new FormBuildStringControl(name)
    }
  }
}