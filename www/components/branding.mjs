const elementName = 'branding-component'

import {goto} from "/system/core.mjs"
import {fire} from "/system/events.mjs"
const template = document.createElement('template');
template.innerHTML = `
    <style>
        h2{
            padding-left: 5px;
            cursor: pointer;
            margin: 4px 0 0.5em 3px;
            font-weight: 400;
            line-height: 1.2;
        }
        #toggle{
          margin-right: 10px;
        }
    </style>

    <h2><span id="toggle">☰</span><span id="text">AX2JS</span></h2>
`;

class IndexPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    
    this.shadowRoot.getElementById("text").addEventListener("click", () => goto("/"))
    this.shadowRoot.getElementById("toggle").addEventListener("click", () => fire("toggle-menu", "branding"))
  }

  connectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

window.customElements.define(elementName, IndexPage);

export {IndexPage as Element, elementName as name}