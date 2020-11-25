let elementName = "field-ref"

import {goto} from "../../system/core.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <style>
    span{
        cursor: pointer;
        color: #11F;
        
    }
    span:hover{
        color: blue;
        color: #11C;
    }
  </style>
  <span><slot/></span>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('span').addEventListener('click', () => goto(this.getAttribute('ref')));
    this.shadowRoot.querySelector('span').addEventListener('mouseup', (e) => {
        if(e.button==1){
            window.open(this.getAttribute('ref'), "_blank")
            return false
        }
    });
    if(!this.getAttribute("title"))
        this.shadowRoot.querySelector('span').title = this.getAttribute('ref');
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}