let reader;
let dataReadyFunction;
export let dataReady = new Promise(ready => {dataReadyFunction = ready})

export function setReader(_reader){
  reader = _reader;
  dataReadyFunction();
}

export function getTableData(tableName){
  return reader.getAllRecords(tableName)
}