import FormControlType from "../enum/FormControlType.mjs"
import FormBuildComboBoxControl from "./FormBuildComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs"
import FormGroup from "./FormGroup.mjs"

export default class FormDesign extends FormGroup{

  init(){
    this.element = document.createElement("ax-formdesign")
    this.element.shadowRoot.getElementById("title").innerText = this.form().metadata.metadata.Design.Caption
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