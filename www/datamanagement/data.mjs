let reader;
let dataReadyFunction;
let recIdCounter = 1;
export let dataReady = new Promise(ready => {dataReadyFunction = ready})
let database = {}
import {getElementByType, 
  getElementById, 
  getEnumMapping} from "../e/class/Metadata.mjs"
let isUpgradeDone = false;
let dataPromises = {}

export async function setReader(_reader){
  reader = _reader;
  dataReadyFunction();
}

export async function tryUpgrade(){
  if(isUpgradeDone) return;
  isUpgradeDone = true;
  try{
    let upgrade = await import("/datamanagement/dataupgrade.mjs")
    if(upgrade && upgrade.default){
      await upgrade.default()
    }
  } catch(err){}
}

export async function getTableData(tableNameOrId){
  let tabMeta = typeof tableNameOrId === "string" ? await getElementByType("table", tableNameOrId) : await getElementById(tableNameOrId)

  if(!tabMeta)
    return []

  let tableName = tabMeta.extends ? tabMeta.extends : tabMeta.name

  
  if(!database[tableName]){
    if(dataPromises[tableName]) 
      await dataPromises;
    else 
      await (dataPromises[tableName] = new Promise(async resolve => {
        
        database[tableName] = await reader.getAllRecords(tableName)

        Object.entries(await getEnumMapping()).forEach(([enumTabName, fields]) => {
          if(enumTabName != tableName) return;

          let fieldKeys = Object.keys(fields)
          database[tableName]?.forEach(r => {
            fieldKeys?.forEach(f => {
              r[f] = fields[f][r[f]]
            })
          })
        })
        resolve()
      }))
  }

  if(tabMeta && tabMeta.extends)
    return database[tabMeta.extends] || []
  else
    return database[tabMeta.name] || []
}

export async function insertRecord(buffer){
  buffer.RecId = getNewRecId();

  let tabMeta = await getElementById(buffer.TableId)
  let tableName = tabMeta.name
  if(tabMeta && tabMeta.extends)
    tableName = tabMeta.extends

  let rawRecord = tabMeta.children.field.reduce((obj, f) => {
    obj[f.name] = buffer[f.name] || null
    return obj
  }, {})
  rawRecord.RecId = buffer.RecId
  
  if(database[tableName])
    database[tableName].push(rawRecord)
  else
    database[tableName] = [rawRecord]
  return rawRecord
}

export async function updateRecord(buffer){
  let tabMeta = await getElementById(buffer.TableId)
  let tableName = tabMeta.name
  if(tabMeta && tabMeta.extends)
    tableName = tabMeta.extends

  if(!buffer.RecId)
    alert("Attempted to update record without RecId")
  let rawRecord = database[tableName].find(r => r.RecId == buffer.RecId)
  tabMeta.children.field.forEach(f => {
    rawRecord[f.name] = buffer[f.name] || null
  })
}

export function getNewRecId(){
  return recIdCounter++;
}