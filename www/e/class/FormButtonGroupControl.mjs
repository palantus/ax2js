import FormControlCollection from "./FormControlCollection.mjs"

export default class FormButtonGroupControl extends FormControlCollection{
  constructor(name){
    super(name);

    this.siteElement = document.createElement("ax-formbuttongroupcontrol")
  }
  
  initFromMeta(meta){
    this.caption(meta.caption || "")
  }

  caption(text = this.pText){
    this.siteElement.setAttribute("label", text)
    return this.pText = text;
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    div{
      /*border: 1px solid black;*/
      padding: 5px;
    }
  </style>
  <div>
    <span id="text"></span>
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

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.shadowRoot.getElementById("text").innerText = newValue
        break;
    }
  }
}

window.customElements.define("ax-formbuttongroupcontrol", Element);