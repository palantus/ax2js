import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertEDT(edt, metadata) {
  edt.tag("edt")

  storeProperties(edt, metadata)

  let references = [...getArray(metadata.TableReferences?.AxEdtTableReference), ...getArray(metadata.Relations?.AxEdtRelation)]

  //TODO: need edt type!
  edt.edtType = metadata["@_type"].substr(5).toLowerCase();

  for(let i = 0; i < references.length; i++){
    let filter = new Entity().tag("edtref").rel(edt, "element");
    edt.rel(filter, "reference")
    storeProperties(filter, references[i])
  }
}

export function expandEDT(e){
  if(!e.extends) return
  let ext = Entity.find(`tag:edt prop:name=${e.extends}`)
  if(!ext){
    console.log(`EDT ${e.name} extends ${e.extends}, which doesn't exist`)
    return;
  }
  //console.log(e.name, e.extends, ext.name)
  expandEDT(ext)
  let extProps = ext.props
  let eProps = e.props
  let newProps = Object.assign({}, extProps, eProps)
  delete newProps.extends;
  Object.assign(e, newProps)
}