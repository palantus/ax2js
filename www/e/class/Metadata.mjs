
import api from "/system/api.mjs"

export let elements = []

export async function load() {
  if(elements.length < 1)
    elements = await api.get("meta")
  return elements
}

export async function getElementByType(type, name, fillMetadata = true){
  let e = elements.find(e => e.type == type && e.name == name)
  if(!e) 
    throw `Element ${name} of type ${type} doesn't exist`
  return fillMetadata ? await api.get("meta/" + e.id) : e;
}