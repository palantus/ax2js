import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertForm(form, metadata) {
  form.tag("form")

  let elementMethods = getArray(metadata.SourceCode?.Methods?.Method)

  for(let method of elementMethods){
    if(method.Name == "classDeclaration"){
      let declElement = new Entity().tag("classdeclaration").rel(form, "element")
      form.rel(declElement, "declaration")
      declElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
    } else {
      let funcElement = new Entity().tag("formfunction").prop("name", method.Name).rel(form, "element")
      form.rel(funcElement, "function")
      funcElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
    }
  }

  let dataSourcesWithMethods = getArray(metadata.SourceCode?.DataSources?.DataSource)
  for(let ds of dataSourcesWithMethods){
    let eDS = new Entity().tag("fds").prop("name", ds.Name).rel(form, "element")
    form.rel(eDS, "ds")

    let dsMethods = getArray(ds.Methods?.Method)
    for(let method of dsMethods){
      let funcElement = new Entity().tag("fdsfunction").prop("name", method.Name).rel(form, "element")
      eDS.rel(funcElement, "function")
      funcElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
    }
    
    let dsFields = getArray(ds.Fields?.Field)
    for(let field of dsFields){
      let f = new Entity().tag("fdsfield").prop("name", field.DataField).rel(form, "element")
      eDS.rel(f, "field")

      let fieldMethods = getArray(field.Methods?.Method)
      for(let method of fieldMethods){
        let funcElement = new Entity().tag("fdsfieldfunction").prop("name", method.Name).rel(form, "element")
        f.rel(funcElement, "function")
        funcElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
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
        let funcElement = new Entity().tag("controlfunction").prop("name", method.Name).rel(form, "element")
        ctl.rel(funcElement, "function")
        funcElement.rel(new Entity().tag("xpp").prop("source", method.Source), "xpp")
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
    storeDS(form, parent, refDS)
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
  if(e.dataField){
    if(!e.dataSource) return;
    let ds = Entity.find(`tag:fds element.id:${e.related.element} prop:name=${e.dataSource}`)

    let fieldName = e.dataField.substr(0, (e.dataField.indexOf("[")+1 || e.dataField.length+1)-1)

    let tableField = Entity.find(`tag:tablefield element.prop:name=${ds.table} prop:name=${fieldName}`)

    if(!tableField){
      let table = Entity.find(`tag:table prop:name=${ds.table}`)
      while(table && table.extends){
        table = Entity.find(`tag:table prop:name=${table.extends}`)
        if(!table) break;
        tableField = table.rels.field?.find(f => f.name == fieldName)
        if(tableField) break;
      }

      if(!tableField){
        console.log(`Control ${e._id}:${e.name} uses table field ${ds.table}.${e.dataField}, which doesn't exist`)
        return;
      }
    }

    e.rel(tableField, "tableField")
  } else if(e.enumType){
    let enumType = Entity.find(`tag:enum prop:name=${e.enumType}`)
    if(!enumType){
      console.log(`Control ${e._id}:${e.name} uses enumType ${e.enumType}, which doesn't exist`)
      return;
    }

    e.rel(enumType, "type")
  }
}

export function expandFDS(fds){
  let table = Entity.find(`tag:table prop:name=${fds.table}`)
  if(table){
    fds.rel(table, "table")
  } else {
    console.log(`FDS ${fds._id} refers to table ${fds.table} which doesn't exist`);
  }
}

export function convertFormExtension(ext, metadata) {
  let formName = ext.name.substring(0, ext.name.lastIndexOf("."))
  ext.formName = formName
  ext.tag("formext")

  //TODO: dangerous, as it depends on forms being imported before extensions
  let form = Entity.find(`tag:form prop:name=${formName}`)

  if(!form){
    console.log(`Form extension ${ext.name} extends form ${formName} which doesn't exist`)
    return
  }

  storeProperties(ext, metadata)
  getArray(metadata.Controls?.AxFormExtensionControl).forEach(m => {
    let extItem = new Entity()
    extItem.tag("formextcontrol")
    ext.rel(extItem, "control")
    ext.rel(form, "form")
    storeProperties(extItem, m)

    storeControl(form, extItem, m.FormControl)
  })
}

export function mergeFormExtension(ext){
  let form = ext.related.form

  ext.rels.control.forEach((item, idx) => {
    let parent = item.parent ? Entity.find(`tag:formcontrol element.id:${form} prop:name=${item.parent}`) : null;
    let previousSibling = item.previousSibling ? Entity.find(`tag:formcontrol element.id:${form} prop:name=${item.previousSibling}`) : null;
    
    if(!parent){
      parent = previousSibling?.relsrev?.control[0] || menu
    }

    parent.rel(item.related.control, "control")

    switch(item.positionType){
      case "AfterItem":
        if(!previousSibling)
          throw "previousSibling is missing"
        item.related.control.positionIdx = previousSibling.positionIdx+(idx/100+0.01)
        break;
      case "Begin":
        item.related.control.positionIdx = (-100)+idx
        break;
      default:
        item.related.control.positionIdx = 1000+idx
    }
  })
}

export function createMissingFormControlsInGroup(e){
  if(!e.dataSource || !e.dataGroup) return;

  let form = e.related.element;
  if(!form) return;
  let ds = Entity.find(`tag:fds element.id:${form} prop:name=${e.dataSource}`)
  if(!ds) return;
  let table = Entity.find(`tag:table prop:name=${ds.table}`)
  if(!table) return;

  let group = table.rels.fieldgroup.find(fg => fg.name == e.dataGroup)
  if(!group) return;

  for(let gf of group.rels?.field||[]){
    let control = e.rels.control?.find(c => c.dataField == gf.dataField)
    if(control) continue;
    let field = table.rels.field.find(f => f.name == gf.dataField)
    if(!field) continue;
    let type = field.rels.type?.[0]
    if(!type) continue;


    switch(type.type){
      case "enum":
        let ctl = new Entity().tag("formcontrol")
                              .rel(form, "element")
                              .prop("dataSource", ds.name)
                              .prop("dataField", gf.dataField)
                              .prop("type", "ComboBox")
                              .rel(field, "tableField")
        e.rel(ctl, "control")
        break;

      default:
        console.log(`Form ${e.related.element.name} has group/grid ${e.name} which is missing field ${gf.dataField} of type ${type.type} (unhandled type!)`)
    }
  }
}

export function updateFormFieldJumpAndLookup(e){
  let tableField = e.related?.tableField
  if(!tableField) return;
  let type = tableField.related?.type
  if(!type) return;
  let ref = type.related?.reference
  if(!ref) return;

  let relatedTable = Entity.find(`tag:table prop:name=${ref.table}`)
  if(!relatedTable?.formRef) return;

  let mi = Entity.find(`tag:menuitem prop:name=${relatedTable.formRef} prop:type=menuitemdisplay`)
  if(!mi) return;

  e.rel(mi, "jumpRef")
}