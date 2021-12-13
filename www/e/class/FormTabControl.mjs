import FormControlCollection from "./FormControlCollection.mjs"
import FormDesign from "./FormDesign.mjs"

export default class FormTabControl extends FormControlCollection{

  init(){
    super.init()
    this.siteElement = document.createElement("ax-formtabcontrol")
  }

  render(){
    super.render();
    if(this.controlCount() < 1) return;
    let tabs = []
    for(let i = 1; i <= this.controlCount(); i++){
      let c = this.controlNum(i)
      tabs.push(c)
    }

    // Change order so that grid view is always shown first. It's a hack until patterns are properly supported.
    if(this.pDesign.properties.pattern == "DetailsMasterTabs" && this.parent instanceof FormDesign){
      tabs = tabs.sort((a, b) => a.properties.style == "DetailsFormGrid" ? -1 : 1)
    }

    for(let i = 1; i <= tabs.length; i++){
      let c = tabs[i-1]
      c.siteElement.setAttribute("slot", `tab${i}`)
      switch(c.properties.style){
        case "DetailsFormDetails":
          this.siteElement.addTab(c.elementId, "Details View")
          break;
        case "DetailsFormGrid":
          this.siteElement.addTab(c.elementId, "Grid View")
          break;
        default:
          this.siteElement.addTab(c.elementId, c.caption() || c.name())
      }
      
    }
  }
}
const template = document.createElement('template');
template.innerHTML = `
  <style>
    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }
    
    /* Style the buttons inside the tab */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 8px 16px;
      transition: 0.3s;
      font-size: 17px;
    }
    
    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }
    
    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }
    
    /* Style the tab content */
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
    }
  </style>
  <div id="buttons" class="tab">
  </div>
  <div id="container">
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.tabClicked = this.tabClicked.bind(this)
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  addTab(elementId, title){
    let container = this.shadowRoot.getElementById("container")

    let idx = container.querySelectorAll(".tabcontent").length + 1;

    let buttons = this.shadowRoot.getElementById("buttons")

    let newbutton = document.createElement("button")
    newbutton.setAttribute("data-element-id", elementId)
    newbutton.classList.add("tablinks")
    newbutton.innerText = title
    newbutton.addEventListener("click", this.tabClicked)
    newbutton.setAttribute("data-idx", idx)
    buttons.appendChild(newbutton)


    let newE = document.createElement("div")
    newE.classList.add("tabcontent")
    
    let slot = document.createElement("slot")
    slot.setAttribute("name", "tab" + idx)
    newE.appendChild(slot)

    if(idx == 1){
      newbutton.classList.add("active")
      newE.style.display = "block"
    }
      
    container.appendChild(newE)
  }

  tabClicked(evt){
    let idx = evt.target.getAttribute("data-idx")
    this.shadowRoot.querySelectorAll(".tabcontent").forEach(e => e.style.display = "none")
    this.shadowRoot.querySelectorAll(".tablinks").forEach(e => e.classList.remove("active"))
    
    this.shadowRoot.querySelector(".tabcontent:nth-child(" + idx + ")").style.display = "block"
    this.shadowRoot.querySelector(".tablinks:nth-child(" + idx + ")").classList.add("active")
    evt.target.classList.add("active")
  }
}

window.customElements.define("ax-formtabcontrol", Element);