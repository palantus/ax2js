import FormField from "./FormField.mjs";

export default class FormImageControl extends FormField{
  constructor(name){
    super(name);

    this.siteElement = document.createElement("ax-formImagecontrol")
  }

  enumType(typeNum){
    
  }

  render(){
    super.render()
  }
}

const template = document.createElement('template');
template.innerHTML = `
<style>
  </style>
  <div>
    IMAGE
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  connectedCallback() {
    this.style.display = "block"
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-formimagecontrol", Element);