let elementName = "dialog-component"
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host{
      z-index: 15;
    }
    #container{
      position: fixed;
      left: 0px;
      right: 0px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.55);
      z-index: 15;
    }
    #dialog{
      position: absolute;
      right: 0px;
      width: 400px;
      height: 100%;
      background: white;
      box-shadow: -5px 0px 50px black;
      padding: 10px;
      overflow: auto;
      padding-bottom: 75px;
    }
    #buttons{
      text-align: right;
      position: absolute;
      bottom: 100px;
      right: 10px;
    }
    button{
      width: 120px;
      height: 30px;
      box-shadow: 3px 3px 5px #ccc;
      background: rgba(255, 255, 255, 0.56);
      border-radius: 7px;
      cursor: pointer;
    }
    #title{
      border-bottom: 1px solid gray;
      margin-top: 0px;
      padding-bottom: 10px;
      user-select: none;
    }
    #validateResult{
      color: red;
      text-align: right;
      position: fixed;
      bottom: 50px;
      right: 10px;
      font-size: 110%;
    }
    :host, :host(dialog-component.hidden){
      pointer-events: none;
    }
    :host(dialog-component.open){
      pointer-events: inherit;
    }
    :host #container{
      opacity: 0;
    }
    :host(dialog-component.open) #container{
      transition: opacity 200ms;
      opacity: 1;
    }
    :host(dialog-component.hidden) #container{
      opacity: 0;
      transition: opacity 200ms;
    }
    :host(dialog-component.open) #dialog {
      position: absolute;
      right: -500px;
      animation: slide 0.3s forwards;
    }
    :host(dialog-component.hidden) #dialog {
      position: absolute;
      right: 0px;
      animation: slideback 0.3s forwards;
    }
    @keyframes slide {
        100% { right: 0; }
    }
    @keyframes slideback {
        100% { right: -500px; }
    }

  </style>
  <div id="container">
    <div id="dialog">
      <h1 id="title"></h1>
      <slot></slot>
      <div id="validateResult"></div>
      <div id="buttons">
        <button id="ok">Ok</button>
        <button id="cancel">Cancel</button>
      </div>
    </div>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
    this.keydown = this.keydown.bind(this);
    this.containerClicked = this.containerClicked.bind(this);

    this.style.width = "100%";
    this.style.height = "100%";
    this.style.position = "fixed";
    this.style.left = "0px";
    this.style.top = "0px";

    this.shadowRoot.getElementById("title").innerText = this.getAttribute("title") || "Dialog"
  }

  connectedCallback() {
    this.shadowRoot.getElementById('ok').addEventListener('click', this.ok);
    this.shadowRoot.getElementById('cancel').addEventListener('click', this.cancel);
    this.shadowRoot.addEventListener("keydown", this.keydown)
    this.shadowRoot.getElementById("container").addEventListener("click", this.containerClicked)
  }

  ok(){
    //this.style.display = "none";
    this.dispatchEvent(new CustomEvent("ok-clicked", {bubbles: false, cancelable: false}));
  }

  cancel(){
    //this.style.display = "none";
    this.dispatchEvent(new CustomEvent("cancel-clicked", {bubbles: false, cancelable: false}));
  }

  keydown(evt){
    switch(evt.keyCode){
      case 27: //esc
        this.shadowRoot.getElementById("cancel").click();
        break;

      case 13: //enter
        if(evt.target.tagName != "TEXTAREA")
          this.shadowRoot.getElementById("ok").click();
        break;
    }
  }

  containerClicked(event){
    if(event.target.id == "container"){ // Clicked on modal transparant area
      this.shadowRoot.getElementById("cancel").click();
    }
  }

  disconnectedCallback() {
    this.shadowRoot.getElementById('ok').removeEventListener('click', this.ok);
    this.shadowRoot.getElementById('cancel').removeEventListener('click', this.cancel);
    this.shadowRoot.removeEventListener("keydown", this.keydown)
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.getElementById("validateResult").innerText = newValue
  }

  static get observedAttributes() {
    return ["validationerror"];
  }  
}

export function showDialog(dialog, {ok, cancel, show, validate, values, close} = {}){
  dialog.classList.add("open");
  dialog.classList.remove("hidden")

  if(typeof show === "function"){
    show();
  }

  let doClose = () => {
    dialog.classList.remove("open");
    dialog.classList.add("hidden")
    dialog.removeEventListener("ok-clicked", okClicked)
    dialog.removeEventListener("cancel-clicked", okClicked)
    dialog.removeAttribute("validationerror")
    
    if(typeof close === "function"){
      close(typeof values === "function" ? values() : {})
    }
  }

  let okClicked = async () => {
    let val = typeof values === "function" ? values() : {}

    if(typeof validate === "function"){
      dialog.removeAttribute("validationerror")

      let validateResult = validate(val)

      if(validateResult === false){
        return;
      }
      if(typeof validateResult === "string"){
        dialog.setAttribute("validationerror", validateResult)
        return;
      }
    }
    if(typeof ok === "function"){
      try{
        await ok(val)
      } catch(err){
        dialog.setAttribute("validationerror", err)
        return;
      }
    }
    doClose();
  }

  let cancelClicked = () => {
    let val = typeof values === "function" ? values() : {}
    if(typeof cancel === "function"){
      cancel(val)
    }
    doClose();
  }

  dialog.addEventListener("ok-clicked", okClicked)
  dialog.addEventListener("cancel-clicked", cancelClicked)
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}