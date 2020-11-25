const elementName = 'systemtools-page'

import "/components/action-bar.mjs"
import "/components/action-bar-item.mjs"
import {on, off} from "/system/events.mjs"
import {state} from "/system/core.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <link rel='stylesheet' href='/css/global.css'>
  <style>
    #container{
        padding: 0px;
        position: relative;
    }
    div.group:not(:first-child){
      margin-top: 10px;
    }
    #group-azure input{
      width: 350px;
    }
    iframe{
      width: 100%;
      height: calc(100vh - 100px);
      border: 0px;
      margin: 0px;
      padding: 0px;
      display: block;
    }
    .tool{
      display: none;
    }
    .tool.active{
      display: block;
    }
  </style>  

  <action-bar>
      <action-bar-item id="dbbrowse-btn">Browse DB</action-bar-item>
      <action-bar-item id="graphql-btn">GraphQL UI</action-bar-item>
  </action-bar>

  <div id="container">
    <iframe id="dbbrowser" frameborder="0" class="tool"></iframe>
    <iframe id="graphql" frameborder="0" class="tool"></iframe>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.refreshData = this.refreshData.bind(this);
    this.showDBBrowser = this.showDBBrowser.bind(this);
    this.showGraphQLUI = this.showGraphQLUI.bind(this);
    this.shadowRoot.getElementById("dbbrowse-btn").addEventListener("click", this.showDBBrowser)
    this.shadowRoot.getElementById("graphql-btn").addEventListener("click", this.showGraphQLUI)

    this.refreshData();
  }

  async refreshData(){
    this.shadowRoot.getElementById("dbbrowser").setAttribute("src", `https://${state().project}/db`);
    this.shadowRoot.getElementById("graphql").setAttribute("src", `https://${state().project}/graphql`);
  }

  async showDBBrowser(){
    this.shadowRoot.getElementById("dbbrowser").classList.add("active")
    this.shadowRoot.getElementById("graphql").classList.remove("active")
  }

  async showGraphQLUI(){
    this.shadowRoot.getElementById("graphql").classList.add("active")
    this.shadowRoot.getElementById("dbbrowser").classList.remove("active")
  }

  connectedCallback() {
    on("changed-project", elementName, this.refreshData)
    on("changed-page", elementName, this.refreshData)
  }

  disconnectedCallback() {
    off("changed-project", elementName)
    off("changed-page", elementName)
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}