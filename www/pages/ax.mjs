const elementName = 'ax-page'

import {state} from "/system/core.mjs"
import api from "/system/api.mjs"
import "/components/field-edit.mjs"

const template = document.createElement('template');
template.innerHTML = `

  <link rel='stylesheet' href='/css/global.css'>
  <style>
    #container{
      padding: 10px;
    }
    #description-header{text-decoration: underline;}
    
	  .grid-container {
      display: grid;
      grid-template-areas:
        'left right';
      grid-gap: 0px;
      grid-template-columns: auto 200px;
    }
    .left{grid-area: left;padding-right: 10px;}
    .grid-container > .right{grid-area: right; border-left: 1px solid rgba(0, 0, 0, 0.1); padding-left: 10px;}
    .fields{
      margin-top: 15px;
    }
    

    label:not(.checkbox):after {
		  content: ":"; 
	  }

    .value{
        display: inline-block;
        min-height:15px;
        min-width: 30px;
    }

    .field{
        display: inline-block;
        position: relative;
    }

    .field.right{
        width: 100%;
    }

    .value.right{
        text-align: right;
        position: absolute;
        right: 0px;
    }

    </style>
    
    <div id="container">

    
	  <h2 id="caption">
    </h2>
  </div>

`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    
    let ps = state().path.split("/");
    let formIdx = ps.indexOf("form")
    let classIdx = ps.indexOf("class")
    let tabIdx = ps.indexOf("table")
    if(formIdx >= 0)
      this.loadForm(ps[formIdx+1])
    else if(classIdx >= 0)
      this.loadClass(ps[classIdx+1])
    else if(tabIdx >= 0)
      this.loadTable(ps[tabIdx+1])
  }

  async loadBasic(){
    this.data = {
      elements: await api.get("meta")
    }
  }

  async loadForm(formName){
    await this.loadBasic();

    let formInfo = this.data.elements.find(i => i.type == "form" && i.name == formName)
    let formData = await api.get("meta/" + formInfo.id)
    
    this.shadowRoot.getElementById("caption").innerText = formData.metadata.Design.Caption || formName
  }

  loadClass(className){
    alert("Class: " + className)
  }

  loadTable(tableName){
    alert("table: " + tableName)
  }

  async showTask(id){
    let {task} = await api.query(`query Task($id: Int){
        task(id: $id){
            id,
            title,
            assignee,
            completedHours, 
            remainingHours, 
            originalHours, 
            closed
        }
    }`, {id})

    //this.shadowRoot.querySelector('.id').innerText = task.id
    //this.shadowRoot.querySelector('.title').innerText = task.title
    
    //this.shadowRoot.querySelector('.description').innerHTML = task.description
    //this.shadowRoot.querySelector('.assignee').setAttribute("value", task.assignee)
    //this.shadowRoot.querySelector('.status').setAttribute("value", task.closed ? "Closed" : "Open")
    
  }

  connectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());

  }

  disconnectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }

}

window.customElements.define(elementName, Element);
export {Element, elementName as name}