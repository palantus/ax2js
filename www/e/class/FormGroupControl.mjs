import FormControlCollection from "./FormControlCollection.mjs"

export default class FormGroup extends FormControlCollection{

  init(){
    super.init()
    this.siteElement = document.createElement("ax-formgroup")
  }
}
const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
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

window.customElements.define("ax-formgroup", Element);