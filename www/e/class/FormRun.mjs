import {pageElement} from "/system/core.mjs"
import "./Form.mjs"
import Form from "./Form.mjs";
import {enumNum} from "./Global.mjs"
import {dataReady, getTableData} from "../../system/data.mjs"
import genForm from "./Form_BuildFromMeta.mjs"
import {getElementByType} from "./Metadata.mjs";

export default class FormRun{
  constructor(args){
    this.args = args
  }

  async init(){
    this.metadata = await getElementByType("form", this.args.name())
    let form = await genForm(this.metadata)

    /*
    let form = new Form(this.args.name());
    let formBuildDesign = await form.addDesign('design');
    let comboBox = await formBuildDesign.addControl(FormControlType.ComboBox,'Enum');
    comboBox.enumType(enumNum("NKDept"));

    let group = await formBuildDesign.addControl(FormControlType.Group, "myGroup")
    await group.addControl(FormControlType.ComboBox, "combo2")
    await group.addControl(FormControlType.String, "string1")
    */

    this._form = form;

    dataReady.then(async () => {
      console.log(await getTableData("AhkPets"))
    })
  }

  form(){
    return this._form
  }

  dataSource(idxOrName){
    return this._form.dataSource(idxOrName)
  }

  async run(){
    await this.init()
    //alert("Run: " + this.args.name())

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