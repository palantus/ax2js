import {getNewRecId} from "./data.mjs"

export default class LD2Reader{
  constructor(buffer, _jszip){
    this.buffer = buffer;
    this.tables = {};
    this.header = {}

    if(_jszip && "undefined" === typeof JSZip){
      this.JSZip = _jszip
    } else {
      this.JSZip = JSZip
    }
  }

  async loadZip(){
    this.zip = await this.JSZip.loadAsync(this.buffer);
  }

  async readMetaFile(){
      let data = await this.zip.file("metadata").async("arraybuffer");
      let dataView = new DataView(data);

      let tableHeaderSize = dataView.getInt32(0);

      let headerRaw = this.byteArray2str(new Uint8Array(data.slice(4, 4+tableHeaderSize)));
      let headerSplit = headerRaw.split(";");

      this.header = {}

      for(let h of headerSplit){
        let vSplit = h.split("=");
        this.header[vSplit[0]] = vSplit[1];
      }

      this.header.tables = this.header.tables.split(",")

      let tables = []
      for(let tabLine of this.header.tables){
        let tabSplit = tabLine.split("*")
        this.tables[tabSplit[0]] = {name: tabSplit[0], recordCount: parseInt(tabSplit[1])}
      }
  }

  async getRecord(tableName, idx){
    let records = await this.getRecordsInRange(tableName, idx, 1);
    return records[0] || null
  }

  async getRecordsInRange(tableName, offset, num){
    if(!this.tables[tableName]) return [];
    await this.fillTableMetadata(tableName);
    let meta = this.tables[tableName];

    let data = await this.zip.file(tableName).async("arraybuffer");
    let dataView = new DataView(data);
    let records = [];

    for(let i = offset; i < Math.min(meta.recordCount, offset+num); i++){
      let record = {};

      let pos = meta.dataPosition + meta.recordPositions[i];

      for(let f = 0; f < meta.fields.length; f++){
        let fieldSize = dataView.getInt32(pos);
        pos += 4;

        if(fieldSize == 0){
          record[meta.fields[f].name] = null;
          continue;
        }

        record[meta.fields[f].name] = this.parseValue(dataView, data, pos, fieldSize, meta.fields[f].type)

        pos += fieldSize;
      }

      if(!record.RecId){
        record.RecId = getNewRecId()
      }

      records.push(record);
    }

    return records
  }

  async getAllRecords(tableName){
    if(!this.tables[tableName]) return [];
    await this.fillTableMetadata(tableName);
    let meta = this.tables[tableName];
    return await this.getRecordsInRange(tableName, 0, meta.recordCount)
  }

  parseValue(dataView, data, pos, length, typeName){
    switch(typeName){
      case "string":
      case "enum":
        return this.byteArray2str(new Uint8Array(data.slice(pos, pos+length)));

      case "integer":
        if(length > 4){
          let bytes = new Uint8Array(data.slice(pos, pos+length))
          return new Uint64BE(bytes) + ""; //Need to represent it as string, because javascript doesn't natively support 64-bit integers
        } else {
          return dataView.getInt32(pos);
        }

      case "real":
        //return Math.round(dataView.getFloat64(pos) * 100) / 100;
        return Math.round(dataView.getFloat64(pos) * 10000) / 10000;

      case "date":
        let daysDiff = dataView.getInt32(pos);
        if(daysDiff > 0)
          return moment("1900-01-01").add(daysDiff, "days")
        break;

      case "datetime":
        let daysDiff2 = dataView.getInt32(pos);
        let timeDiff = dataView.getInt32(pos+4);
        if(daysDiff2 > 0)
          return moment.utc("1900-01-01").add(daysDiff2, "days").add(timeDiff, "seconds").local()
        break;

      case "container":
        let con = []
        let curOffset = 0;
        while(curOffset < length){
          let typeLength = dataView.getInt32(pos+curOffset);
          curOffset += 4;
          let itemType = this.byteArray2str(new Uint8Array(data.slice(pos+curOffset, pos+curOffset+typeLength)));
          curOffset+= typeLength;
          let valueLength = dataView.getInt32(pos+curOffset);
          curOffset += 4;
          con.push(this.parseValue(dataView, data, pos+curOffset, valueLength, itemType));
          curOffset += valueLength;
        }
        //console.log(con);
        return con;
    }
    return null;
  }

  async fillTableMetadata(tableName){
    if(!this.tables[tableName]) 
      return;

    if(this.tables[tableName].dataPosition !== undefined)
      return;

    let data = await this.zip.file(tableName).async("arraybuffer");
    let dataView = new DataView(data);

    let tableHeaderSize = dataView.getInt32(0);

    let header = this.byteArray2str(new Uint8Array(data.slice(4, 4+tableHeaderSize)));
    let headerSplit = header.split(";");
    let fieldsLine = headerSplit[1].split(",");
    let fields = [];
    for(let fieldStr of fieldsLine){
      let fieldSplit = fieldStr.split(":");
      fields.push({name: fieldSplit[0], type: fieldSplit[1]})
    }

    let dataPosition = 4 + tableHeaderSize;
    let numRecords = parseInt(headerSplit[2]);
    let recordPositions = []
    for(let i = 0; i < numRecords; i++){
      recordPositions.push(dataView.getInt32(dataPosition));
      dataPosition += 4;
    }

    this.tables[tableName] = {name: tableName, fields: fields, recordCount: numRecords, dataPosition: dataPosition, recordPositions: recordPositions}
  }

  async read(){
    await this.loadZip();
    await this.readMetaFile();
  }

  getTableNamesAsArray(){
    let tabs = []
    for(let tableName in this.tables){
      tabs.push(tableName)
    }
    return tabs.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
  }

  byteArray2str(byteArray){
    return new TextDecoder("utf-8").decode(byteArray);
  }
}