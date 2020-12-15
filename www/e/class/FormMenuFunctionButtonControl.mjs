import FormButtonControl from "./FormButtonControl.mjs"
//import {goto} from "../../system/core.mjs"
import MenuFunction from "./MenuFunction.mjs";

export default class FormMenuFunctionButtonControl extends FormButtonControl{
  
  initFromMeta(meta){
    super.initFromMeta(meta)
    this.text(meta.children?.menuItem[0]?.label || this.menuItemName())
  }

  menuItemName(text = this.properties.menuItemName){
    return this.properties.menuItemName = text;
  }

  clicked(){
    new MenuFunction(this.menuItemName()).run();
    //goto(this.menuItemName())
  }
}