import FormControlCollection from "./FormControlCollection.mjs";

export default class FormGridControl extends FormControlCollection{
  async init(){
    super.init()
    this.siteElement = document.createElement("ax-formgridcontrol");
  }

  onNewData(data){
    this.siteElement.data = data.map(r => this.controls.reduce((obj, c) => {obj[c.dataField()] = c.record2StrValue(r); return obj}, {}))
  }

  render(){
    super.render();
    let head = []
    for(let ctl of this.controls)
      head.push({title: ctl.label(), field: ctl.dataField()})
    this.siteElement.head = head
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
    table{
      width: 100%;
      border: 1px solid black;
      margin-top: 5px;
    }
    td{
      border-bottom: 1px dotted gray;
    }
    th{
      text-align: left;
      border-bottom: 1px solid black;
    }
    #controls{
      display: none;
    }
  </style>

  <div>
    <table>
      <thead>
        <tr></tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div id="controls">
      <slot/>
    </div>
  </div>

`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  set head(head){
    this.gridHead = head;
    let tHead = this.shadowRoot.querySelector("thead tr");
    tHead.innerHTML = '';
    for(let h of head){
      let th = document.createElement("th")
      th.innerText = h.title;
      tHead.append(th)
    }
  }

  set data(data){
    this.gridData = data

    let t = this.shadowRoot.querySelector("tbody");
    for(let d of data){
      let row = document.createElement("tr")
      for(let f of this.gridHead){
        let field = document.createElement("td");
        field.innerText = d[f.field]
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