import FormControlType from "../enum/FormControlType.mjs"
import FormBuildComboBoxControl from "./FormBuildComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs"
import FormControlCollection from "./FormControlCollection.mjs"

export default class FormDesign extends FormControlCollection{

  init(){
    this.design(this)
    this.siteElement = document.createElement("ax-formdesign")
  }

  caption(text = this.pCaption || ""){
    this.siteElement.shadowRoot.getElementById("title").innerText = text
    return this.pCaption = text
  }
}
const template = document.createElement('template');
template.innerHTML = `
  <style>
    h2{
      margin-top: 5px;
      margin-botton: 0px;
    }
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