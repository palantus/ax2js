import FormField from "./FormField.mjs";

export default class FormInt64Control extends FormField{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formint64control")
  }

  enumType(typeNum){
    
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <span style="color: red">Int64</span>
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

window.customElements.define("ax-formint64control", Element);