import {pageElement} from "/system/core.mjs"
import "./Form.mjs"
import Form from "./Form.mjs";
import {enumNum} from "./Global.mjs"
import genForm from "./Form_BuildFromMeta.mjs"
import {getElementByType} from "./Metadata.mjs";

export default class FormRun{
  constructor(args){
    this.args = args

    this.close = this.close.bind(this)
  }

  async init(){
    this.metadata = await getElementByType("form", this.args.name())
    this.pForm = await genForm(this.metadata)
    this.pForm.render()

    for(let ds of this.pForm.dataSources){
      ds.init()
    }
  }

  form(){
    return this.pForm
  }

  dataSource(idxOrName){
    return this.pForm.dataSource(idxOrName)
  }

  async run(){
    await this.init()

    Array.from(pageElement().getElementsByTagName("ax-form")).forEach(e => e.style.display = "none");
    pageElement().append(this.form().siteElement);

    document.addEventListener("keydown", (evt) => {
      switch(evt.keyCode){
        case 27: //esc
          if(this.form().siteElement.style.display != "none" && pageElement().getElementsByTagName("ax-form").length > 1)
            this.close();
          break;
      }
    })
  }

  async wait(){
    console.log("wait stub")
  }

  detach(){

  }

  close(){
    if(!this.form().siteElement.isConnected) return;
    pageElement().removeChild(this.form().siteElement);
    let elements = pageElement().getElementsByTagName("ax-form")
    if(elements.length > 0)
      elements[elements.length - 1].style.display = "block"
  }
}