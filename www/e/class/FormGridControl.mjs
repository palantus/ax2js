import FormControlCollection from "./FormControlCollection.mjs";

export default class FormGridControl extends FormControlCollection{
  async init(){
    this.siteElement = document.createElement("ax-formgridcontrol");
  }

  onNewData(data){
    this.siteElement.data = data
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
    <tbody id="tdata>
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

  set data(data){
    this.data = data

    let t = this.shadowRoot.getElementById("tdata");
    for(let d of data){
      let row = document.createElement("tr")
      for(let f in d){
        let field = document.createElement("td");
        field.innerText = d[f]
        row.append(field)
      }
      t.append(row)
    }
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