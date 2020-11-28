const elementName = 'main-menu'
import {goto, state} from "../system/core.mjs"
import {on} from "../system/events.mjs"
import api from "/system/api.mjs"

const template = document.createElement('template');
template.innerHTML = `
    <link rel='stylesheet' href='/css/mainmenu.css'>

    <div id="container">
    </div>
`;

class Page extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fetchAndUpdateMainMenu()

    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    
    this.shadowRoot.querySelector("#container").addEventListener("click", event => {
      if(event.target.classList.contains("item")){
        goto(event.target.getAttribute("data-path"))
      } else if(event.target.parentElement.classList.contains("item")){
        goto(event.target.parentElement.getAttribute("data-path"))
      }

      if(event.target.classList.contains("menu")){
        this.toggleMenu(event.target)
      } else if(event.target.parentElement.classList.contains("menu")){
        this.toggleMenu(event.target.parentElement)
      }
    })

    on("changed-page", "mainmenu", () => this.updateSelected())
    on("toggle-menu", "mainmenu", () => document.getElementById("grid-container").classList.toggle("collapsed"))
  }

  async fetchAndUpdateMainMenu(){
    let menu = await api.get("meta/menu")

    let container = this.shadowRoot.querySelector("#container")
    this.addMenu(container, menu)
  }

  toggleMenu(menu){
    let display = menu.classList.contains("open") ? "none" : "block";
    menu.classList.toggle("open")
    let mi = menu.nextSibling
    while(mi){
      if(mi.classList.contains("menu"))
        break;

      mi.style.display = display
      mi = mi.nextSibling
    }
  }

  updateSelected(){
    this.shadowRoot.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"))
    this.shadowRoot.querySelectorAll(".menu").forEach(e => e.classList.remove("open"))
    //this.shadowRoot.querySelectorAll(".item").forEach(e => e.style.display = "none")
    this.shadowRoot.querySelectorAll(`.item[data-path="${state().path}"]`).forEach(e => {
      e.classList.add("selected")

      let sib = e.previousSibling;
      while(sib){
        if(sib.classList.contains("menu")) {
          sib.classList.add("open")
          break;
        }
        sib = sib.previousSibling;
      }
    })

    this.shadowRoot.querySelectorAll(".menu.open").forEach(m => {
      let item = m.nextSibling
      while(item){
        if(item.classList.contains("menu"))
          break;

        item.style.display = "block"
        item = item.nextSibling
      }
    })
  }

  addMenu(parent, content){
    for(let menu of content){
      let item = document.createElement("div")
      let titleElement = document.createElement("span")
      item.appendChild(titleElement)

      if(menu.type == "menuitem" || menu.type == "fixeditem"){
        item.className = "item"
        titleElement.attributes.class = "itemtitle"
        titleElement.innerText = " - " + menu.label

        item.setAttribute("data-path", menu.page || "/ax/mi/" + menu.name)
      } else {
        item.className = "menu"
        titleElement.innerText = menu.label
        
        let arrow = document.createElement("span")
        arrow.className = "menuarrow"
        arrow.innerText = " ▾"
        item.appendChild(arrow)
      }

      parent.appendChild(item)

      if(menu.type == "submenu" || menu.type == "fixedsubmenu"){
        let subParent = document.createElement("div")
        subParent.classList.add("submenu")
        /*
        let subParentTitle = document.createElement("h2")
        subParentTitle.innerText = menu.label
        subParent.append(subParentTitle)
        */
        item.append(subParent)
        this.addMenu(subParent, menu.items);
      }
    }

    this.updateSelected();
  }

  connectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

window.customElements.define(elementName, Page);

export {Page as Element, elementName as name}