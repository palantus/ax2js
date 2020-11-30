import FormControl from "./FormControl.mjs";

export default class FormStringControl extends FormControl{
  constructor(name){
    super(name);
    this.name = name;
  }

  async init(){
    this.element = document.createElement("ax-formstringcontrol");
    this.element.setAttribute("label", this.name);
  }
}

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
        margin-bottom: 5px;
    }

    .value.right{
        /*text-align: right;
        position: absolute;
        right: 0px;*/
    }
    label{
      width: 100px;
      display: inline-block;
      vertical-align: top;
    }
  </style>
  <div class="field">
      <label for="val"></label>
      <span name="val" class="value right"><input type="text"></input></span>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  }

  connectedCallback() {
    this.shadowRoot.querySelector('label').innerText = this.getAttribute("label")
    this.style.display = "block"

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))
  }

  disconnectedCallback() {
  }
}

window.customElements.define("ax-formstringcontrol", Element);