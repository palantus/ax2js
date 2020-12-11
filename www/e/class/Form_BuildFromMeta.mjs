import Form from "./Form.mjs";
import FormControlType from "../enum/FormControlType.mjs"

export default async function build(meta){
  let form = new Form(meta.name);
  
  for(let dsMeta of meta.children.ds || []){
    let fds = await form.addDataSource(dsMeta.name)
    fds.initFromMeta(dsMeta)
  }

  let designMeta = meta.children.design[0];

  let formBuildDesign = await form.addDesign('design');
  formBuildDesign.caption(designMeta.caption || meta.name)

  for(let c of designMeta.children.control || []){
    await addControlToParent(formBuildDesign, c)
  }

  return form;
}

async function addControlToParent(parent, control){
  if(!control.type) return;
  let controlObj = await parent.addControl(FormControlType[control.type], control.name);
  if(!controlObj) return;
  controlObj.initFromMeta(control);

  for(let c of control.children.control || []){
    await addControlToParent(controlObj, c)
  }
}