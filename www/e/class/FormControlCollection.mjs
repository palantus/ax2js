import FormControlType from "../enum/FormControlType.mjs"
import FormControl from "./FormControl.mjs"

export default class FormControlCollection extends FormControl{

  constructor(name){
    super(name);
    this.controls = []
  }

  init(){
    super.init();
    this.controls.forEach(c => c.init())
  }

  async addControl(type, name){
    let [k] = Object.entries(FormControlType).find(([k, v]) => v == type) || [null]
    if(!k){
      console.log("Unknown control type in FormGroup/Design: " + type)
      return null;
    }
    let newControl;
    try{
      newControl = new (await import(`./Form${k}Control.mjs`)).default(name);

      if(!newControl){
        console.log("Unknown control type in FormGroup/Design: " + type)
        return null;
      }
    } catch(err) {
      console.log(err)
      console.log("Unknown control type in FormGroup/Design: " + k)
      return null;
    }
    this.controls.push(newControl)
    newControl.design(this.design())
    return newControl;
  }

  controlNum(idx){
    return this.controls[idx-1]
  }

  controlCount(){
    return this.controls.length
  }

  render(){
    super.render();

    if(!this.siteElement){
      console.log("Missing siteElement on control " + this.name(), this)
    }

    this.controls.forEach(c => c.render())
    this.controls.forEach(c => this.siteElement.append(c.siteElement))
  }
}