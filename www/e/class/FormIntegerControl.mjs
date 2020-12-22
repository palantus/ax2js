import FormField from "./FormField.mjs";

export default class FormIntegerControl extends FormField{
  constructor(name){
    super(name);
    this.name = name;

    this.siteElement = document.createElement("ax-formintegercontrol")
  }

  enumType(typeNum){
    
  }

  onActiveRecord(record){
    this.siteElement.setAttribute("valuestr", this.record2StrValue(record))
  }

  render(){
    super.render()
    this.siteElement.setAttribute("label", this.label())
  }

  record2StrValue(record){
    return (""+record?.[this.dataField()]) || ""
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
      <span name="val" class="value right"><input type="number"></input></span>
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

window.customElements.define("ax-formintegercontrol", Element);