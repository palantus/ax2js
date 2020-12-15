import FormField from "./FormField.mjs";
import {getElementByType} from "./Metadata.mjs";
import {enumNum} from "./Global.mjs";

export default class FormComboBoxControl extends FormField{
  constructor(name){
    super(name);

    this.siteElement = document.createElement("ax-formcomboboxcontrol")
    this.enumMetadata = null
  }

  initFromMeta(meta){
    super.initFromMeta(meta)
    this.enumMetadata =  meta.children.type?.[0] || meta.children.tableField?.[0]?.children?.type?.[0] || null
    this.properties.enumType = meta.enumType || meta.children.tableField?.[0].enumType || meta.children.tableField?.[0]?.children?.type?.[0]?.name || ""
  }

  enumType(typeNum){
    return enumNum(this.properties.enumType)
  }

  onActiveRecord(record){
    this.siteElement.setAttribute("value", record?.[this.dataField()] || "")
  }

  render(){
    super.render()
    this.siteElement.setAttribute("label", this.label())

    if(this.enumMetadata)
      this.siteElement.values = this.enumMetadata.children?.value?.map(v => {return {value: v.name, label: v.label || ""}}) || []
    else
      console.log(`Enum ${this.properties.enumType} not loaded for field`, this)
  }

  record2StrValue(record){
    return this.enumMetadata?.children.value?.find(v => v.name == record?.[this.dataField()])?.label || ""
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
      <span name="val" class="value right"><select></select></span>
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

  set values(values){
    let e = this.shadowRoot.querySelector("select")
    e.innerHTML = '';
    values.forEach(v => {
      let vE = document.createElement("option")
      vE.setAttribute("value", v.value)
      vE.innerText = v.label
      e.appendChild(vE)
    })
  }

  static get observedAttributes() {
    return ['label', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.shadowRoot.querySelector('label').innerText = newValue
        break;
      case 'value':
        this.shadowRoot.querySelector('select').value = newValue
        break;
    }
  }
}

window.customElements.define("ax-formcomboboxcontrol", Element);