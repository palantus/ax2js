import { readdirSync, readFileSync, unlinkSync} from 'fs'
import parser from 'fast-xml-parser';
import Entity from "entitystorage"
import Element from "./models/element.js";
import {convert, expandAllElements, mergeExtensions} from "./services/convert.mjs"

class D365{

  constructor(lang = 'da'){
    this.lang = lang
    this.labels = {}
  }

  async readFolder(path){

    let models = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);

    for(let m of models){
      this.readModelLabels(`${path}/${m}/${m}`)
    }

    for(let m of models){
      this.readModelElements(`${path}/${m}/${m}`)
    }                        
  }

  async readModelElements(path){
    this.elements = []
    this.path = path
    let typeFolders = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory() && dirent.name != "AxLabelFile")
                        .map(dirent => dirent.name);

    for(let f of typeFolders)
      this.readType(`${path}/${f}`)

    console.log("Finished elements from reading " + path)
    return this
  }

  async readModelLabels(path){
    this.elements = []
    this.path = path
    let typeFolders = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory() && dirent.name == "AxLabelFile")
                        .map(dirent => dirent.name);

    if(typeFolders.length < 1)
      return;

    let folder = `${path}/${typeFolders[0]}`
    this.readType(folder)

    console.log("Finished reading labels from " + path)
    return this
  }

  readLabels(path){
    let labelFiles = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => !dirent.isDirectory())
                        .map(dirent => dirent.name);

    for(let f of labelFiles){
      let labels = readFileSync(`${path}/${f}`, {encoding:'utf8', flag:'r'});
      let labelsObj;
      let prefix;
      labels = labels.substr(labels.indexOf("@"))
      if(f.endsWith(".ald"))
        labelsObj = labels.split("\r\n").filter(l => l.startsWith("@")).reduce((obj, cur) => {let s = cur.split(' '); obj[s.shift().toLocaleLowerCase()] = s.join(" "); return obj;}, {})
      else
        labelsObj = labels.split("\r\n").filter(l => !l.startsWith(" ;")).reduce((obj, cur) => {
          let s = cur.split('='); 

          if(!prefix){
            prefix = s[0].replace(/[0-9]/g, '');
          }

          if(s[0].startsWith("@"))
            obj[s[0].toLocaleLowerCase()] = s[1]; 
          else{
            obj[`${prefix}:${s[0]}`.toLocaleLowerCase()] = s[1]
          }
          return obj;
        }, {})
      Object.assign(this.labels, labelsObj)

      console.log("Finished reading label file " + f) 
    }
  }

  readType(folder){
    let files = readdirSync(folder, { withFileTypes: true })
                      .filter(dirent => !dirent.isDirectory())
                      .map(dirent => dirent.name);
    for(let f of files){
      let content = readFileSync(`${folder}/${f}`, {encoding:'utf8', flag:'r'}); 

      let obj = parser.parse(content, {ignoreAttributes : false, ignoreNameSpace : true});
      let typeName = Object.keys(obj)[0];
      let element = {type: typeName.substr(2).toLowerCase(), name: obj[typeName].Name, metadata: obj[typeName]}

      if(!element.name)
        throw `Element is missing name: ${typeName}: ${f}`

      if(element.type != "labelfile")
        this.replaceElementLabels(element)

      let e = Element.lookupType(element.type, element.name);
      if(!e){
        e = new Element()
                  .prop("name", element.name)
                  .prop("type", element.type)
                  .tag("element");

        switch(element.type){
          case "labelfile":
              let lang = element.metadata.Name.substr(element.metadata.Name.indexOf("_")+1)
              let labels = readFileSync(`${folder}/LabelResources/${lang}/${element.metadata.LabelContentFileName}`, {encoding:'utf8', flag:'r'}); 
              let labelsObj = labels.split("\r\n").filter(l => l.startsWith("@")).reduce((obj, cur) => {let s = cur.split('='); obj[s[0].toLocaleLowerCase()] = s[1]; return obj;}, {})

              if(lang == "da")
                Object.assign(this.labels, labelsObj)

              e.prop("language", lang)
              e.setBlob(JSON.stringify(labelsObj))
              break;
          default: 
            convert(e, element.metadata)
        }
      }
    }
  }

  replaceElementLabels(element){
    this.replaceObjectLabels(element.metadata);
  }

  replaceObjectLabels(obj){
    if(Array.isArray(obj)){
      for(let a of obj){
        this.replaceObjectLabels(a)
      }
    } else if(typeof obj === "object"){
      for(let a in obj){
        if(typeof obj[a] === "string"){
          if(obj[a].startsWith("@")){
            obj[a] = this.labels[obj[a].toLocaleLowerCase()] || obj[a]
          }
        } else if(typeof obj[a] === "object"){
          this.replaceObjectLabels(obj[a])
        }
      }
    }
  }
}


let run = async () => {
  try{unlinkSync("data/props.data")}catch(err){}
  try{unlinkSync("data/tags.data")}catch(err){}
  try{unlinkSync("data/blob_1.data")}catch(err){}
  try{unlinkSync("data/blob_index.data")}catch(err){}
  try{unlinkSync("data/rels.data")}catch(err){}
  
  await Entity.init("./data");
  Entity.search("tag:element").delete();
  let d365 = new D365();
  d365.readLabels("input/labels")
  d365.readFolder("input/models")

  expandAllElements()
  mergeExtensions()
}
run();