import FormControlType from "../enum/FormControlType.mjs"
import FormBuildComboBoxControl from "./FormBuildComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs"

export default class FormDesign{
  constructor(name){
    this.name = name;

    this.element = document.createElement("ax-formdesign")
  }

  init(){
    this.element.shadowRoot.getElementById("title").innerText = this.form().metadata.metadata.Design.Caption
  }

  form(form){
    if(form)
      this._form = form;
    return this._form;
  }

  addControl(type, name){
    let newControl;
    switch(type){
      case FormControlType.ComboBox:
        newControl = new FormBuildComboBoxControl(name)
        break;
      case FormControlType.String:
        newControl = new FormBuildStringControl(name)
        break;
    }

    if(!newControl)
      throw "Unknown control type in FormDesign"
    
    newControl.design(this)
    this.element.append(newControl.element);
    return newControl;
  }
}
const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <h2 id="title"></h2>
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

window.customElements.define("ax-formdesign", Element);