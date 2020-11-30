import FormControl from "./FormControl.mjs";

export default class FormStringControl extends FormControl{
  constructor(name){
    super(name);
    this.name = name;
  }

  async init(){
    this.element = document.createElement("ax-formgridcontrol");
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    table{
      width: 100%;
    }
  </style>
  <table>
    <thead>
      <tr>
      </tr>
    </thead>
    <tbody>
    </tbody>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  connectedCallback() {
    this.shadowRoot.querySelector('label').innerText = this.getAttribute("label")
    this.style.display = "block"

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-formgridcontrol", Element);