import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertTable(table, metadata) {
  table.tag("table")

  storeProperties(table, metadata)
  addSubItemsToTable(table, metadata)
}

export function convertTableExtension(tableExt, metadata) {
  tableExt.tag("tableext")

  storeProperties(tableExt, metadata)

  let tableName = tableExt.name.substring(0, tableExt.name.lastIndexOf("."))
  let table = Entity.find(`tag:table prop:name=${tableName}`)

  if(!table){
    console.log(`Table extension ${tableExt.name} extends table ${tableName} which doesn't exist`)
    return
  }

  addSubItemsToTable(table, metadata)
}

function addSubItemsToTable(table, metadata){
  let methods = getArray(metadata.SourceCode?.Methods?.Method)
  for(let method of methods){
    table.rel(new Entity().tag("tablefunction").prop("name", method.Name).prop("sourceXPP", method.Source).rel(table, "element"), "function")
  }

  let fieldGroups = getArray(metadata.FieldGroups?.AxTableFieldGroup)
  for(let fieldGroup of fieldGroups){
    let fg = new Entity().tag("tablefieldgroup").prop("name", fieldGroup.Name).rel(table, "element")
    table.rel(fg, "fieldgroup")
    storeProperties(fg, fieldGroup)

    let fields = getArray(fieldGroup.Fields?.AxTableFieldGroupField)
    for(let field of fields){
      let f = new Entity().tag("tablefieldgroupfield").rel(table, "element")
      fg.rel(f, "field")
      storeProperties(f, field)
    }
  }

  let fields = getArray(metadata.Fields?.AxTableField)
  for(let field of fields){
    let f = new Entity().tag("tablefield").rel(table, "element")
    table.rel(f, "field")

    storeProperties(f, field)
  }

  let indices = getArray(metadata.Indexes?.AxTableIndex)
  for(let index of indices){
    let idx = new Entity().tag("tableindex").rel(table, "element")
    table.rel(idx, "index")
    storeProperties(idx, index)

    let fields = getArray(index.Fields?.AxTableIndexField)
    for(let field of fields){
      let f = new Entity().tag("tableindexfield").rel(table, "element")
      idx.rel(f, "field")
      storeProperties(f, field)
    }
  }

  let relations = getArray(metadata.Relations?.AxTableRelation)
  for(let relation of relations){
    let rel = new Entity().tag("tablerelation").rel(table, "element")
    table.rel(rel, "relation")
    storeProperties(rel, relation)

    let constraints = getArray(relation.Constraints?.AxTableRelationConstraint)
    for(let constraint of constraints){
      let c = new Entity().tag("tablerelationconstraint").rel(table, "element")
      rel.rel(c, "constraint")
      storeProperties(c, constraint)
    }
  }
}

export function expandTableField(e){
  let ext;
  if(e.extendedDataType){
    ext = Entity.find(`tag:edt prop:name=${e.extendedDataType}`)
    if(!ext){
      console.log(`Field ${e.name} uses datatype ${e.extendedDataType}, which doesn't exist`)
      return;
    }
  } else if(e.enumType){
    ext = Entity.find(`tag:enum prop:name=${e.enumType}`)
    if(!ext){
      console.log(`Field ${e.name} uses datatype ${e.enumType}, which doesn't exist`)
      return;
    }
  }

  if(ext){
    e.rel(ext, "type")
  }
}

/*
export function mergeTableExtension(ext){
  let tableName = ext.name.substring(0, ext.name.lastIndexOf("."))
  let table = Entity.find(`tag:table prop:name=${tableName}`)
  if(!table){
    console.log(`table extension ${ext.name} extends a table which doesn't exist`)
    return;
  }

  for(let r in ext.rels){
    ext.rels[r].forEach(related => table.rel(related, r))
  }
}
*/