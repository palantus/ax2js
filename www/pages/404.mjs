const elementName = 'error-404'

const template = document.createElement('template');
template.innerHTML = `
    <style>
        h1{
            color: red;
            padding: 10px;
        }
    </style>
    <h1>404: Unknown page</h1>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}