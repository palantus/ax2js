import FormBuildDesign from "./FormBuildDesign.mjs";
import FormDataSource from "./FormDataSource.mjs"

export default class Form{
  constructor(name){
    this.name = name;
    this.siteElement = document.createElement("ax-form")
    this.dataSources = []
    this.eventHandlers = {}
  }

  init(){
    this.design.init();
  }

  async addDesign(name){
    //this.siteElement.shadowRoot.getElementById("title").innerText = (await this.metadata).metadata.Design.Caption
    this.design = new FormBuildDesign(name)
    this.design.parent = this
    
    return this.design
  }

  async addDataSource(nameOrType){
    let fds
    if(typeof nameOrType !== "string"){
      fds = new nameOrType()
    } else {
      fds = new FormDataSource();
    }
    fds.name(name)
    fds.form(this)
    fds.parent = this
    this.dataSources.push(fds)
    return fds;
  }

  dataSource(idxOrName){
    let res;
    if(!idxOrName)
      res = this.dataSources[0]
    else if(isNaN(idxOrName))
      res = this.dataSources.find(d => d.name() == idxOrName)
    else
      res = this.dataSources[idxOrName-1]
      
    if(!res){
      console.log("Missing datasource", idxOrName, this)
    }
    return res || null;
  }

  dataSourceCount(){
    return this.dataSources.length
  }

  render(){
    this.design.render()
    this.siteElement.append(this.design.siteElement)
    this.siteElement.setAttribute("data-element-id", this.elementId)
  }

  formRun(formRun){
    if(formRun) this.pFormRun = formRun;
    return this.pFormRun;
  }

  owner(){
    return this.formRun()
  }

  on(eventName, id, fn){
    if(this.eventHandlers[eventName] === undefined)
      this.eventHandlers[eventName] = []

    this.eventHandlers[eventName].push({fn, id})
  }

  off(eventName, id){
    if(this.eventHandlers[eventName] === undefined)
      return;

    this.eventHandlers[eventName] = handlers[eventName].filter(h => h.id != id)
  }

  fire(eventName, data){
    if(this.eventHandlers[eventName] === undefined)
      return;

    this.eventHandlers[eventName].forEach(h => h.fn(data))
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