let elementName = "action-bar-item"
const template = document.createElement('template');
template.innerHTML = `
    <style>
        span.item{
            display: inline-block;
            padding: 4px 5px 1px 5px;
            background-color: rgba(255, 255, 255, 0.1);
            margin: 2px;
        }

        span.item:last-child{
            border-right: 0px;
        }

        span.item:hover{
            background-color: rgba(150, 150, 150, 0.1);
            cursor: pointer;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1)
        }

        span.separator{
            display: inline-block;
            border-right: 1px solid rgba(0, 0, 0, 0.1);
            margin-left: 10px;
            margin-right: 10px;
            min-height: 1.5em;
            margin-bottom: -5px;
        }

        span.container:last-child .separator{
            display: none;
        }

        span.content{
            bottom: 2px;
            position: relative;
        }
        span.container{
          user-select: none;
        }
    </style>
    <span class="container"><span class="item"><span class="content"><slot/></span></span><span class="separator"/></span>
`;

class Element extends HTMLElement {
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

window.customElements.define(elementName, Element);
export {Element, elementName as name}