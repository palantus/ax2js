import FormControl from "./FormControl.mjs";

export default class FormCheckBoxControl extends FormControl{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formcheckboxcontrol")
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  Checkbox
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

window.customElements.define("ax-formcheckboxcontrol", Element);