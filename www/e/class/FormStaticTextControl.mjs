import FormField from "./FormField.mjs";

export default class FormStaticTextControl extends FormField{
  constructor(name){
    super(name);
  }

  async init(){
    super.init()
    this.siteElement = document.createElement("ax-formstatictextcontrol");
    this.siteElement.setAttribute("label", this.name());
  }

  render(){
    super.render()
    this.siteElement.setAttribute("text", this.properties.text)
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <h3 id="text"></h3>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  connectedCallback() {
    this.shadowRoot.getElementById('text').innerText = this.getAttribute("text")
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'text':
        this.shadowRoot.getElementById('text').innerText = newValue
        break;
    }
  }
}

window.customElements.define("ax-formstatictextcontrol", Element);