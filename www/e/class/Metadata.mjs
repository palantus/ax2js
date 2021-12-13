
import api from "../../system/api.mjs"

export let elements = []
let cache = {}
let loadPromise = null;
let enumMapping = null;

export async function load() {
  if(elements.length < 1)
    loadPromise = api.get("meta")
  return elements = await loadPromise
}

export function getElementBasicInfoByType(type, name){
  return elements.find(e => e.type == type && e.name == name)
}

export function getElementBasicInfoById(id){
  return elements.find(e => e.id == id)
}

export async function getElementByType(type, name, fillMetadata = true){
  if(elements.length > 0){
    let e = elements.find(e => e.type == type && e.name == name)
    if(!fillMetadata)
      return e;

    let cachedElement = cache[e.id];
    if(cachedElement) 
      return cachedElement;
  }

  return cacheElement(await api.get(`meta/${type}/${name}`))
}

export async function getElementById(id, fillMetadata = true){
  if(!id) return null;
  if(elements.length > 0){
    let e = elements.find(e => e.id == id)
    if(!fillMetadata)
      return e;

    let cachedElement = cache[e.id];
    if(cachedElement) 
      return cachedElement;
  }

  return cacheElement(await api.get(`meta/${id}`))
}

export function getCachedElementByType(type, name){
  let e = elements.find(e => e.type == type && e.name == name)
  return getCachedElementById(e?.id) || null
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

export async function getEnumMapping(){
  if(!enumMapping)
    enumMapping = await api.get(`meta/fieldEnumMapping`)
  return enumMapping
}