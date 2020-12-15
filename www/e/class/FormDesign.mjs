import FormControlType from "../enum/FormControlType.mjs"
import FormBuildComboBoxControl from "./FormBuildComboBoxControl.mjs"
import FormBuildStringControl from "./FormBuildStringControl.mjs"
import FormControlCollection from "./FormControlCollection.mjs"

export default class FormDesign extends FormControlCollection{

  constructor(name){
    super(name);
    this.design(this)
  }

  init(){
    super.init();
    this.siteElement = document.createElement("ax-formdesign")
  }

  initFromMeta(meta){
    super.initFromMeta(meta)
    this.caption(meta.caption)
  } 

  render(){
    super.render();
    this.siteElement.shadowRoot.getElementById("title").innerText = this.properties.caption
  }

  caption(text = this.properties.caption || ""){
    return this.properties.caption = text
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