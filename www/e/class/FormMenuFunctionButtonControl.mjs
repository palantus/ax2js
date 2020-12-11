import FormButtonControl from "./FormButtonControl.mjs"
//import {goto} from "../../system/core.mjs"
import MenuFunction from "./MenuFunction.mjs";

export default class FormMenuFunctionButtonControl extends FormButtonControl{
  async init(...args){
    return super.init(...args)
  }
  
  initFromMeta(meta){
    this.menuItemName(meta.menuItemName)
    this.text(meta.children?.menuItem[0]?.label || this.menuItemName())
  }

  menuItemName(text = this.pMenuItemName){
    this.siteElement.setAttribute("label", text)
    return this.pMenuItemName = text;
  }

  clicked(){
    new MenuFunction(this.menuItemName()).run();
    //goto(this.menuItemName())
  }
}