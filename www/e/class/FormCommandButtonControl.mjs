import FormButtonControl from "./FormButtonControl.mjs"
//import {goto} from "../../system/core.mjs"
import MenuFunction from "./MenuFunction.mjs";

export default class FormCommandButtonControl extends FormButtonControl{
  async init(...args){
    return super.init(...args)
  }
  
  initFromMeta(meta){
    super.initFromMeta(meta)
    //this.menuItemName(meta.MenuItemName)
  }
/*
  menuItemName(text = this.pMenuItemName){
    this.siteElement.setAttribute("label", text)
    return this.pMenuItemName = text;
  }*/

  clicked(){
    //new MenuFunction(this.menuItemName()).run();
    //goto(this.menuItemName())
    alert("Command clicked")
  }
}