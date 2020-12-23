import FormButtonControl from "./FormButtonControl.mjs"
import MenuFunction from "./MenuFunction.mjs";
import Args from "./Args.mjs"


export default class FormMenuFunctionButtonControl extends FormButtonControl{
  
  initFromMeta(meta){
    super.initFromMeta(meta)
    this.text(meta.children?.menuItem?.[0]?.label || this.menuItemName())
  }

  menuItemName(text = this.properties.menuItemName){
    return this.properties.menuItemName = text;
  }

  clicked(){
    let args = new Args()
    args.dataset(this.owner().dataSource(1).table())
    args.record(this.owner().dataSource(1).cursor())
    new MenuFunction(this.menuItemName()).run(args);
  }
}