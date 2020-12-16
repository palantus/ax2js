import FormControlCollection from "./FormControlCollection.mjs"

export default class FormTabPageControl extends FormControlCollection{

  init(){
    super.init()
    this.siteElement = document.createElement("ax-formtabpagecontrol")
  }

  caption(caption = this.properties.caption){
    return this.properties.caption = caption
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