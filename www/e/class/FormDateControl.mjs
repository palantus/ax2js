import FormField from "./FormField.mjs";

export default class FormDateControl extends FormField{
  constructor(name){
    super(name);

    this.siteElement = document.createElement("ax-formdatecontrol")
  }

  enumType(typeNum){
    
  }

  label(label = this.pLabel){
    return (this.pLabel = label) || this.name()
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  Date
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

window.customElements.define("ax-formdatecontrol", Element);