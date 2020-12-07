import FormControlCollection from "./FormControlCollection.mjs"

export default class FormTabPageControl extends FormControlCollection{

  init(){
    this.siteElement = document.createElement("ax-formtabpagecontrol")
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

window.customElements.define("ax-formtabpagecontrol", Element);