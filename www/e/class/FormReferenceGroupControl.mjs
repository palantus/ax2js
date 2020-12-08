import FormField from "./FormField.mjs";

export default class FormReferenceGroupControl extends FormField{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formreferencegroupcontrol")
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

window.customElements.define("ax-formreferencegroupcontrol", Element);