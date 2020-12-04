import FormControlCollection from "./FormControlCollection.mjs";

export default class FormGridControl extends FormControlCollection{
  async init(){
    this.siteElement = document.createElement("ax-formgridcontrol");
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    table{
      width: 100%;
    }
  </style>

  <div>
  Grid
  <slot/>
  <table>
    <thead>
      <tr>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
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

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-formgridcontrol", Element);