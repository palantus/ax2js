const { readdirSync, readFileSync, unlinkSync} = require('fs')
const parser = require('fast-xml-parser');
let Entity = require("entitystorage")
let Element = require("./models/element.js");

class D365{

  async readFolder(path){
    try{unlinkSync("data/props.data")}catch(err){}
    try{unlinkSync("data/tags.data")}catch(err){}
    try{unlinkSync("data/blob_1.data")}catch(err){}

    let models = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);

    for(let m of models){
      this.readModel(`${path}/${m}/${m}`)
    }                        
  }

  async readModel(path){
    this.elements = []
    this.path = path
    let typeFolders = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);

    for(let f of typeFolders)
      this.readType(`${path}/${f}`)

    console.log("Finished reading " + path)
    return this
  }

  readType(folder){
    let files = readdirSync(folder, { withFileTypes: true })
                      .filter(dirent => !dirent.isDirectory())
                      .map(dirent => dirent.name);
    for(let f of files){
      let content = readFileSync(`${folder}/${f}`, {encoding:'utf8', flag:'r'}); 

      let obj = parser.parse(content);
      let typeName = Object.keys(obj)[0];
      let element = {type: typeName.substr(2).toLowerCase(), name: obj[typeName].Name, metadata: obj[typeName]}

      if(!element.name)
        throw `Element is missing name: ${typeName}: ${f}`

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
              let labelsObj = labels.split("\n").filter(l => l.startsWith("@")).map(l => {let s = l.split('='); return {id: s[0], text: s[1]}})
              e.prop("language", lang)
              e.setBlob(labels)
              break;
        }
      }

      e.prop("metadata", element.metadata);
    }
  }
}


let run = async () => {
  await Entity.init("./data");
  Entity.search("tag:element").delete();
  new D365().readFolder("input/models")
}
run();