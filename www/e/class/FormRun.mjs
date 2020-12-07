import {pageElement} from "/system/core.mjs"
import "./Form.mjs"
import Form from "./Form.mjs";
import {enumNum} from "./Global.mjs"
import genForm from "./Form_BuildFromMeta.mjs"
import {getElementByType} from "./Metadata.mjs";

export default class FormRun{
  constructor(args){
    this.args = args
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

    pageElement().innerHTML = '';
    pageElement().append(this.form().siteElement);
  }

  async wait(){
    console.log("wait stub")
  }

  detach(){

  }

  close(){
    
  }
}