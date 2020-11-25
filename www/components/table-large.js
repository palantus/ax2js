const template = document.createElement('template');
template.innerHTML = `
  <style>
    ::slotted(table) {
        border: 1px solid black;
    }
  </style>
  <span><slot name="headertext"/></span>
  
    <slot>Empty</slot>
  
`;

class TableLarge extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    //this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    //this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
  }

  connectedCallback() {
      console.log(this.shadowRoot.querySelectorAll('td'))
    this.shadowRoot.querySelectorAll('td').forEach(e => e.addEventListener('click', () => alert("test")));
  }

  disconnectedCallback() {
    //this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

window.customElements.define('table-large', TableLarge);