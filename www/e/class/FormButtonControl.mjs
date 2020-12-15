import FormControl from "./FormControl.mjs";

export default class FormButtonControl extends FormControl{
  async init(){
    super.init()
    this.siteElement = document.createElement("ax-formbuttoncontrol")

    this.clicked = this.clicked.bind(this);
    this.siteElement.addEventListener("clicked", this.clicked)
  }

  text(text = this.properties.text){
    return this.properties.text = text;
  }

  render(){
    super.render()
    this.siteElement.setAttribute("label", this.properties.text)
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