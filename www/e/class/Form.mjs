import FormBuildDesign from "./FormBuildDesign.mjs";
import FormDataSource from "./FormDataSource.mjs"

export default class Form{
  constructor(name){
    this.name = name;
    this.siteElement = document.createElement("ax-form")
    this.dataSources = []
  }

  async addDesign(name){
    //this.siteElement.shadowRoot.getElementById("title").innerText = (await this.metadata).metadata.Design.Caption
    this.design = new FormBuildDesign(name)
    this.design.form(this)
    await this.design.init();

    this.siteElement.append(this.design.siteElement)
    return this.design
  }

  async addDataSource(name){
    let fds = new FormDataSource();
    fds.name(name)
    this.dataSources.push(fds)
    return fds;
  }

  dataSource(idxOrName){
    throw "Form.datasource stub"
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  
  <slot/>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    /*this.shadowRoot.querySelector('label').innerText = this.getAttribute("label")
    this.style.display = "block"

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))
    */
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-form", Element);