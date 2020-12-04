import FormControl from "./FormControl.mjs";

export default class FormMenuFunctionButtonControl extends FormControl{
  async init(){
    this.siteElement = document.createElement("ax-menufunctionbuttoncontrol")
  }
  
  initFromMeta(meta){
    this.menuItemName(meta.MenuItemName)
  }

  menuItemName(text = this.pText){
    this.siteElement.setAttribute("label", text)
    return this.pText = text;
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <button id="btn"></button>
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

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.shadowRoot.getElementById("btn").innerText = newValue
        break;
    }
  }
}

window.customElements.define("ax-menufunctionbuttoncontrol", Element);