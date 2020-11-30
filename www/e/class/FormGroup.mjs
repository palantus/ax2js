import FormControlType from "../enum/FormControlType.mjs"
import FormBuildComboBoxControl from "./FormBuildComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs"
import FormControl from "./FormControl.mjs"

export default class FormGroup extends FormControl{

  init(){
    this.element = document.createElement("ax-formgroup")
    this.design(this)
  }

  form(form){
    if(form)
      this._form = form;
    return this._form;
  }

  async addControl(type, name){
    let newControl;
    switch(type){
      case FormControlType.ComboBox:
        newControl = new FormBuildComboBoxControl(name)
        break;
      case FormControlType.String:
        newControl = new FormBuildStringControl(name)
        break;
      case FormControlType.Group:
        newControl = new FormGroup(name)
        break;
    }

    if(!newControl)
      throw "Unknown control type in FormGroup/Design"
    
    await newControl.init();
    newControl.design(this.design())
    this.element.append(newControl.element);
    return newControl;
  }
}
const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <slot/>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-formgroup", Element);