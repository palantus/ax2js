import FormField from "./FormField.mjs";

export default class FormDateControl extends FormField{
  constructor(name){
    super(name);

    this.siteElement = document.createElement("ax-formdatecontrol")
  }

  enumType(typeNum){
    
  }

  record2StrValue(record){
    let val = record?.[this.dataField()]
    return val ? new Date(val).toISOString().substr(0, 10) : ""
  }

  onActiveRecord(record){
    this.siteElement.setAttribute("valuestr", this.record2StrValue(record))
  }

  render(){
    super.render()
    this.siteElement.setAttribute("label", this.label())
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
    this.style.display = "block"
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return ['label', 'valuestr'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.shadowRoot.querySelector('label').innerText = newValue
        break;
      case 'valuestr':
        this.shadowRoot.querySelector('input').value = newValue
        break;
    }
  }
}

window.customElements.define("ax-formdatecontrol", Element);