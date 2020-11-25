const elementName = 'index-page'
import {goto} from "../system/core.mjs"

const template = document.createElement('template');
template.innerHTML = `
    <style>
      #container{
        padding: 10px;
      }
      h1, figure {
        text-align: center;
        margin: 0 auto;
      }
    
      h1 {
        font-size: 2.8em;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 0.5em 0;
      }
    
      figure {
        margin: 0 0 1em 0;
      }
    
      img {
        width: 100%;
        max-width: 400px;
        margin: 0 0 1em 0;
      }
    
      @media (min-width: 480px) {
        h1 {
          font-size: 4em;
        }
      }
    </style>

    <h1>It's alive!</h1>

    <figure>
      <img alt='Borat' src='/img/great-success.png'>
    </figure>
`;

class IndexPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

window.customElements.define(elementName, IndexPage);

export {IndexPage as Element, elementName as name}