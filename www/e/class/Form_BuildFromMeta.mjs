import Form from "./Form.mjs";
import FormControlType from "../enum/FormControlType.mjs"

export default async function build(meta){
  let form = new Form(meta.name);
  
  let dssMeta = [].concat(meta.metadata.DataSources)

  for(let dsMeta of dssMeta){
    let fds = form.addDataSource(dsMeta.Name)
    fds.initFromMeta(dsMeta)
  }

  let designMeta = meta.metadata.Design;

  let formBuildDesign = await form.addDesign('design');
  formBuildDesign.caption(designMeta.Caption || meta.name)

  if(designMeta.Controls){
    for(let c of [].concat(designMeta.Controls.AxFormControl)){
      await addControlToParent(formBuildDesign, c)
    }
  }

  return form;
}

async function addControlToParent(parent, control){
  if(!control.Type) return;
  let controlObj = await parent.addControl(FormControlType[control.Type], control.Name);
  if(!controlObj) return;
  controlObj.initFromMeta(control);

  if(control.Controls){
    for(let c of [].concat(control.Controls.AxFormControl)){
      await addControlToParent(controlObj, c)
    }
  }
}