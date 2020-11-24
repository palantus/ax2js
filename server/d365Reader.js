const { readdirSync, readFileSync} = require('fs')
const parser = require('fast-xml-parser');
let Element = require("./element.js");
const Tags = require('entitystorage/types/tags');

class D365{
  async readFolder(path){
    this.elements = []
    this.path = path
    let typeFolders = readdirSync(path, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name);

    for(let f of typeFolders)
      this.readType(`${path}/${f}`)

    console.log("Finished reading " + path)
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
      }

      e.prop("metadata", element.metadata);
    }
  }
}

module.exports = D365