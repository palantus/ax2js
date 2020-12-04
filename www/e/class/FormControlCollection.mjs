import FormControlType from "../enum/FormControlType.mjs"
import FormControl from "./FormControl.mjs"

export default class FormControlCollection extends FormControl{

  async addControl(type, name){
    let [k] = Object.entries(FormControlType).find(([k, v]) => v == type) || [null]
    if(!k){
      console.log("Unknown control type in FormGroup/Design: " + type)
      return null;
    }
    let newControl;
    try{
      newControl = new (await import(`./Form${k}Control.mjs`)).default();

      if(!newControl){
        console.log("Unknown control type in FormGroup/Design: " + type)
        return null;
      }
    } catch(err) {
      console.log(err)
      console.log("Unknown control type in FormGroup/Design: " + k)
      return null;
    }
    
    newControl.design(this.design())
    await newControl.init();
    this.siteElement.append(newControl.siteElement);
    return newControl;
  }
}