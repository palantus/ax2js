import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertForm(form, metadata) {
  form.tag("form")

  let elementMethods = getArray(metadata.SourceCode?.Methods?.Method)

  for(let method of elementMethods){
    form.rel(new Entity().tag("formfunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(form, "element"), "function")
  }



  let dataSourcesWithMethods = getArray(metadata.SourceCode?.DataSources?.DataSource)
  for(let ds of dataSourcesWithMethods){
    let eDS = new Entity().tag("fds").prop("name", ds.Name).rel(form, "element")
    form.rel(eDS, "ds")

    let dsMethods = getArray(ds.Methods?.Method)
    for(let method of dsMethods){
      eDS.rel(new Entity().tag("fdsfunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(form, "element"), "function")
    }
    
    let dsFields = getArray(ds.Fields?.Field)
    for(let field of dsFields){
      let f = new Entity().tag("fdsfield").prop("name", field.DataField).rel(form, "element")
      eDS.rel(f, "field")

      let fieldMethods = getArray(field.Methods?.Method)
      for(let method of fieldMethods){
        f.rel(new Entity().tag("fdsfieldfunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(form, "element"), "function")
      }
    }
  }

  let dataSources = getArray(metadata.DataSources?.AxFormDataSource)
  for(let ds of dataSources){
    storeDS(form, form, ds)
  }

  let design = new Entity().tag("formdesign").prop("name", "Design").rel(form, "element")
  form.rel(design, "design")
  storeProperties(design, metadata.Design)

  let controls = getArray(metadata.Design.Controls?.AxFormControl)
  for(let control of controls){
    storeControl(form, design, control)
  }

  let controlsWithMethods = getArray(metadata.SourceCode?.DataControls?.Control)
  for(let control of controlsWithMethods){
    let ctl = Entity.find(`tag:formcontrol prop:name=${control.Name} element.id:${form}`)
    if(ctl){
      let controlMethods = getArray(control.Methods?.Method)
      for(let method of controlMethods){
        ctl.rel(new Entity().tag("controlfunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(form, "element"), "function")
      }
    } else {
      console.log(`Warning: Form ${form.name} has source code for control ${control.Name}, but it doesn't exist`)
    }
  }
}


function storeDS(form, parent, ds){
  let eDS = Entity.find(`tag:fds element.id:${form} prop:name=${ds.Name}`)
  if(!eDS){
    eDS = new Entity().tag("fds").prop("name", ds.Name).rel(form, "element")
    parent.rel(eDS, "ds")
  }

  storeProperties(eDS, ds)

  let dsFields = getArray(ds.Fields?.AxFormDataSourceField)
  for(let field of dsFields){
    let f = new Entity().tag("fdsfield").prop("name", field.DataField).rel(form, "element")
    eDS.rel(f, "field")

    storeProperties(f, field);
  }

  let refDSs = getArray(ds.ReferencedDataSources?.AxFormReferencedDataSource)
  for(let refDS of refDSs){
    storeDS(form, eDS, refDS)
  }
}

function storeControl(element, parent, metadata){
  let ctl = new Entity().tag("formcontrol").rel(element, "element")
  parent.rel(ctl, "control")

  storeProperties(ctl, metadata)

  let controls = getArray(metadata.Controls?.AxFormControl)
  for(let control of controls){
    storeControl(element, ctl, control)
  }
}

export function expandFormControl(e){
  if(!e.dataSource) return;
  let ds = Entity.find(`tag:fds element.id:${e.related.element} prop:name=${e.dataSource}`)

  if(e.dataField){

    let fieldName = e.dataField.substr(0, (e.dataField.indexOf("[")+1 || e.dataField.length+1)-1)

    let tableField = Entity.find(`tag:tablefield element.prop:name=${ds.table} prop:name=${fieldName}`)

    if(!tableField){
      console.log(`Control ${e._id}:${e.name} uses table field ${ds.table}.${e.dataField}, which doesn't exist`)
      return;
    }

    e.rel(tableField, "tableField")
  }
}