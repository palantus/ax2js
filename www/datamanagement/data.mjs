let reader;
let dataReadyFunction;
let recIdCounter = 1;
export let dataReady = new Promise(ready => {dataReadyFunction = ready})
let database = {}
import {getCachedElementByType, getCachedElementById, getEnumMapping} from "../e/class/Metadata.mjs"
let isUpgradeDone = false;

export async function setReader(_reader){
  reader = _reader;

  await Promise.all([...Object.keys(reader.tables).map(tabName => new Promise(async r => {
    database[tabName] = await reader.getAllRecords(tabName)
    r()
  })), getEnumMapping()])

  Object.entries(await getEnumMapping()).forEach(([tableName, fields]) => {
    let fieldKeys = Object.keys(fields)
    database[tableName]?.forEach(r => {
      fieldKeys?.forEach(f => {
        r[f] = fields[f][r[f]]
      })
    })
  })

  recIdCounter = reader.recIdCounter || 1

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

export function getTableData(tableNameOrId){
  let tabMeta = typeof tableNameOrId === "string" ? getCachedElementByType("table", tableNameOrId) : getCachedElementById(tableNameOrId)
  if(!tabMeta)
    return []
  else if(tabMeta && tabMeta.extends)
    return database[tabMeta.extends] || []
  else
    return database[tabMeta.name] || []
}

export function insertRecord(buffer){
  buffer.RecId = recIdCounter++;

  let tabMeta = getCachedElementById(buffer.TableId)
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