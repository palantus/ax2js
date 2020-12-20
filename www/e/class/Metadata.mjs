
import api from "/system/api.mjs"

export let elements = []
let cache = {}

export async function load() {
  if(elements.length < 1)
    elements = await api.get("meta")
  return elements
}

export async function getElementByType(type, name, fillMetadata = true){
  let e = elements.find(e => e.type == type && e.name == name)
  if(!e) 
    throw `Element ${name} of type ${type} doesn't exist`
  return fillMetadata ? cache[e.id] = await api.get("meta/" + e.id) : e;
}

export function getCachedElementByType(type, name){
  let e = elements.find(e => e.type == type && e.name == name)
  if(e)
    return getCachedElementById(e.id)
  else
    throw `Element of type ${type} and name ${name} isn't cached`
}

export function getCachedElementById(id){
  if(cache[id])
    return cache[id]
  else
    throw `Element with id ${id} isn't cached`
}