import Form from "./Form.mjs";
import FormControlType from "../enum/FormControlType.mjs"

export default async function build(meta, fr){
  let form = new Form(meta.name);
  form.elementId = meta.id;
  
  for(let dsMeta of meta.children.ds || []){
    let fds = await form.addDataSource(Object.getPrototypeOf(fr)?.constructor?.controlTypes?.[dsMeta.name] || dsMeta.name)
    fds.initFromMeta(dsMeta)
  }

  let designMeta = meta.children.design[0];

  let formBuildDesign = await form.addDesign('design');
  formBuildDesign.caption(designMeta.caption || meta.name)
  formBuildDesign.initFromMeta(designMeta)

  for(let c of designMeta.children.control || []){
    await addControlToParent(formBuildDesign, c, fr)
  }

  return form;
}

async function addControlToParent(parent, control, fr){
  if(!control.type) return;
  let controlObj = await parent.addControl(Object.getPrototypeOf(fr)?.constructor?.controlTypes?.[control.name] || FormControlType[control.type], control.name);
  if(!controlObj) {
    console.log("ERROR: control.addControl must return new instance!")
    return;
  }
  controlObj.initFromMeta(control);

  for(let c of control.children.control || []){
    await addControlToParent(controlObj, c, fr)
  }
}