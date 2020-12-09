import Entity from "entitystorage"
import {getArray, storeProperties} from "./tools.mjs"

export function convertEnum(enumeration, metadata) {
  enumeration.tag("enum")

  storeProperties(enumeration, metadata)

  let values = getArray(metadata.EnumValues?.AxEnumValue)

  for(let value of values){
    let v = new Entity().tag("tablefield").rel(enumeration, "element")
    enumeration.rel(v, "value")
    storeProperties(v, value)
  }
}