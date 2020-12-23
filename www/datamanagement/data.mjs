let reader;
let dataReadyFunction;
let recIdCounter = 1;
export let dataReady = new Promise(ready => {dataReadyFunction = ready})
let database = {}
import {getCachedElementByType} from "../e/class/Metadata.mjs"
let isUpgradeDone = false;

export async function setReader(_reader){
  reader = _reader;

  await Promise.all(Object.keys(reader.tables).map(tabName => new Promise(async r => {
    database[tabName] = await reader.getAllRecords(tabName)
    r()
  })))
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

export function getTableData(tableName){
  let tabMeta = getCachedElementByType("table", tableName)
  if(tabMeta && tabMeta.extends)
    return database[tabMeta.extends] || []
  else
    return database[tableName] || []
}

export function insertRecord(tableName, record){
  if(!record.RecId)
    record.RecId = recIdCounter++;

  let tabMeta = getCachedElementByType("table", tableName)
  if(tabMeta && tabMeta.extends)
    tableName = tabMeta.extends

  if(database[tableName])
    database[tableName].push(record)
  else
    database[tableName] = [record]
  return record
}