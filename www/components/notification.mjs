let elementName = "notification-component"
const template = document.createElement('template');
template.innerHTML = `
  <style>
    #container{
      padding: 5px;
      /*border: 1px solid gray;*/
      /*border-radius: 5px;*/
      box-shadow: 0px 0px 5px #ddd;
      background: rgba(255, 255, 255, 0.9);
    }

    p{
      font-size: 120%;
      margin-top: 0px;
      margin-bottom: 5px;
    }

    #body{

    }

    :host{
      display: block;
    }

    #bottombar{
      border-top: 1px solid #ddd;
      margin-top: 5px;
      font-size: 65%;
      padding-top: 3px;
      position: relative;
    }

    #close{
      position: absolute;
      right: 3px;
      padding-right: 3px;
      padding-left: 3px;
      cursor: pointer;
      user-select: none;
    }

    #close:hover{
      position: absolute;
      right: 3px;
      background-color: #eee;
    }

  </style>
  <div id="container">
    <p id="title">Untitled</p>
    <div id="body"><slot></slot></div>
    <div id="bottombar">
      <span id="timestamp"></span><span title="Discard notification" id="close">X</span>
    </div>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if(this.hasAttribute("title"))
      this.shadowRoot.getElementById("title").innerText = this.getAttribute("title")

    if(this.hasAttribute("timestamp"))
      this.shadowRoot.getElementById("timestamp").innerText = this.getAttribute("timestamp")
    else
      this.shadowRoot.getElementById("timestamp").innerText = "N/A"

    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
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