import FormControl from "./FormControl.mjs";

export default class FormButtonControl extends FormControl{
  async init(){
    this.siteElement = document.createElement("ax-formbuttoncontrol")

    this.clicked = this.clicked.bind(this);
    this.siteElement.addEventListener("clicked", this.clicked)
  }
  
  initFromMeta(meta){
    this.text(meta.text)
  }

  text(text = this.pText){
    this.siteElement.setAttribute("label", text)
    return this.pText = text;
  }

  clicked(){
    
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <button id="btn"></button>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.clicked = this.clicked.bind(this)
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.getElementById("btn").addEventListener("click", this.clicked)
  }

  clicked(){
    this.dispatchEvent(new Event("clicked"))
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
        this.shadowRoot.getElementById("btn").innerText = newValue
        break;
    }
  }
}

window.customElements.define("ax-formbuttoncontrol", Element);