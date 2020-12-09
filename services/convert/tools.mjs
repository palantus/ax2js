export function getArray(potentialArray){
  return potentialArray ? Array.isArray(potentialArray) ? potentialArray : [potentialArray] : []
}

export function storeProperties(entity, metadata){
  for(let p in metadata){
    if(!metadata[p] || typeof metadata[p] === "object") continue;
    if(p.startsWith("@")) continue; // Attribute

    let name = p[0].toLowerCase() + p.substring(1)
    let value = metadata[p]
    
    if(value === "No")
      value = false;
    else if(value === "Yes")
      value = true;
    
      entity.prop(name, metadata[p])
  }
}