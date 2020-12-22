import FormControlCollection from "./FormControlCollection.mjs";

export default class FormGridControl extends FormControlCollection{
  async init(){
    super.init()
    this.siteElement = document.createElement("ax-formgridcontrol");

    this.rowClicked = this.rowClicked.bind(this);
    this.siteElement.addEventListener("rowclicked", this.rowClicked)
  }

  onNewData(data){
    this.siteElement.data = data.map(r => this.controls.reduce((obj, c) => {
      obj[c.dataField()] = c.record2StrValue(r[c.dataSource()]); 
      return obj
    }, {}))
  }

  render(){
    super.render();
    let head = []
    for(let ctl of this.controls)
      head.push({title: ctl.label(), field: ctl.dataField()})
    this.siteElement.head = head
  }

  rowClicked(evt){
    this.owner().form().dataSource(this.dataSource()).findIndex(evt.detail+1)
  }

  dataSource(){
    return this.properties.dataSource
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
    tr{
      cursor: pointer;
    }
    tr.active{
      background-color: rgba(100, 100, 255, 0.4);
    }
    #controls{
      display: none;
    }
  </style>

  <div>
    <table cellspacing="0">
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
    this.rowClicked = this.rowClicked.bind(this)
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
    t.innerHTML = '';
    for(let d of data){
      let row = document.createElement("tr")
      for(let f of this.gridHead){
        let field = document.createElement("td");
        field.innerText = d[f.field]
        row.append(field)
      }
      t.append(row)
    }
    this.shadowRoot.querySelector("tbody tr")?.classList.add("active")
  }

  connectedCallback() {
    this.style.display = "block"

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))

    this.shadowRoot.querySelector("table").addEventListener("click", this.rowClicked)
  }

  disconnectedCallback() {
  }

  rowClicked(evt){
    let row = evt.target.matches("tbody tr") ? evt.target : evt.target.closest("tbody tr");
    if(!row) return;
    this.shadowRoot.querySelectorAll("tbody tr").forEach(r => r.classList.remove("active"))
    row.classList.add("active")
    const idx = [...row.parentElement.children].indexOf(row);
    this.dispatchEvent(new CustomEvent("rowclicked", {detail: idx}))
  }
}

window.customElements.define("ax-formgridcontrol", Element);