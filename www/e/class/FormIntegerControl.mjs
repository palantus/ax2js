import FormField from "./FormField.mjs";

export default class FormIntegerControl extends FormField{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formintegercontrol")
  }

  enumType(typeNum){
    
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <span style="color: red">Integer</span>
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

window.customElements.define("ax-formintegercontrol", Element);