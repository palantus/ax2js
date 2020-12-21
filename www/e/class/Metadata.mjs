
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
  return cache[e.id] || (fillMetadata ? cacheElement(await api.get("meta/" + e.id)) : e);
}

export function getCachedElementByType(type, name){
  let e = elements.find(e => e.type == type && e.name == name)
  return getCachedElementById(e.id) || null
}

export function getCachedElementById(id){
  return cache[id] || null
}

function cacheElement(e){
  cache[e.id] = e;

  for(let r in e.children){
    for(let c of e.children[r]){
      cacheElement(c)
    }
  }

  return e;
}