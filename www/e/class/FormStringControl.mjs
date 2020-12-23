import FormField from "./FormField.mjs";

export default class FormStringControl extends FormField{
  async init(){
    super.init()
    this.siteElement = document.createElement("ax-formstringcontrol");
    this.jumpRef = this.jumpRef.bind(this);
    this.siteElement.addEventListener("jumpRef", this.jumpRef)
  }

  onActiveRecord(record){
    this.siteElement.setAttribute("valuestr", this.record2StrValue(record))
  }

  render(){
    super.render()
    this.siteElement.setAttribute("label", this.label())
    if(this.hasJumpRef()){
      this.siteElement.setAttribute("hasref", "true")
      this.siteElement.setAttribute("reflabel", this.pJumpRef.label || "Reference")
    }
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
      width: 200px;
      display: inline-block;
      vertical-align: top;
    }
    #jumpref{
      display: none;
    }
  </style>
  <div class="field">
      <label for="val"></label>
      <span name="val" class="value right"><input type="text"></input></span>
      <button id="jumpref">JUMP</button>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.jumpRefClicked = this.jumpRefClicked.bind(this)
    this.shadowRoot.getElementById("jumpref").addEventListener("click", this.jumpRefClicked)

  }

  jumpRefClicked(){
    this.dispatchEvent(new Event("jumpRef"))
  }

  connectedCallback() {
    this.style.display = "block"

    if(this.hasAttribute("right"))
      this.shadowRoot.querySelectorAll('span').forEach(e => e.classList.add("right"))
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return ['label', 'valuestr', 'hasref', 'reflabel'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.shadowRoot.querySelector('label').innerText = newValue
        break;
      case 'valuestr':
        this.shadowRoot.querySelector('input').value = newValue
        break;
      case 'hasref':
        this.shadowRoot.getElementById("jumpref").style.display = newValue == "true" ? "inline-block" : "none"
        break;
      case 'reflabel':
        this.shadowRoot.getElementById("jumpref").innerText = newValue
        break;
    }
  }
}

window.customElements.define("ax-formstringcontrol", Element);