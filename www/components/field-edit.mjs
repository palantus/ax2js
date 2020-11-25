let elementName = "field-edit"

import {goto} from "../../system/core.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <style>
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
  <span class="field">
      <label></label>
      <span class="value" contenteditable></span>
  </span>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('label').innerText = this.getAttribute("label")
    this.shadowRoot.querySelector('span.value').addEventListener('input', () => console.log(this.shadowRoot.querySelector('span.value').innerText));

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))

    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          this.shadowRoot.querySelector('span.value').innerText = this.getAttribute("value")
        }
      });
    });
    
    observer.observe(this, {
      attributes: true 
    });
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}