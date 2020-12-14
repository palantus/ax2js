import FormControlCollection from "./FormControlCollection.mjs"

export default class FormActionPaneControl extends FormControlCollection{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formactionpanecontrol")
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  div{
    border: 1px solid black;
    padding: 5px;
    margin-bottom: 10px;
  }
  </style>
  <div>
    <slot/>
  </div>
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

window.customElements.define("ax-formactionpanecontrol", Element);