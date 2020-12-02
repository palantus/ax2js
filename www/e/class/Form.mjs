import FormBuildDesign from "./FormBuildDesign.mjs";
import {getElementByType} from "./Metadata.mjs";
import FormDataSource from "./FormDataSource.mjs"

export default class Form{
  constructor(name){
    this.name = name;
    this.metadata = getElementByType("form", name)
    this.element = document.createElement("ax-form")
    this.dataSources = []
  }

  async addDesign(name){
    //this.element.shadowRoot.getElementById("title").innerText = (await this.metadata).metadata.Design.Caption

    this.metadata = await this.metadata;

    this.design = new FormBuildDesign(name)
    this.design.form(this)
    await this.design.init();

    this.element.append(this.design.element)
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