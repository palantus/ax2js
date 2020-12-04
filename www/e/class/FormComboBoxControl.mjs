import FormControl from "./FormControl.mjs";

export default class FormComboBoxControl extends FormControl{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formcomboboxcontrol")
  }

  enumType(typeNum){
    
  }

  label(label = this.pLabel){
    return (this.pLabel = label) || "N/A"
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  Combobox
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

window.customElements.define("ax-formcomboboxcontrol", Element);