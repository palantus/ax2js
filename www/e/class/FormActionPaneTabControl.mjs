import FormControlCollection from "./FormControlCollection.mjs"

export default class FormActionPaneTabControl extends FormControlCollection{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formactionpanetabcontrol")
  }

  async initFromMeta(meta){
    await super.initFromMeta(meta)
    this.caption(meta.caption)
  }

  caption(caption = this.pCaption){
    return this.pCaption = caption
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
  <div id="container">
    <slot/>
  </div>
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

window.customElements.define("ax-formactionpanetabcontrol", Element);