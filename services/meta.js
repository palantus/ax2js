
let Element = require("../models/element")

class Service{
  genMenu(){
    let menu = []
    let ext = Element.search("tag:element prop:type=menuextension")
    let menus = Element.search("tag:element prop:type=menu")

    let menusInMainMenu = []
    for (let x of ext) {
      if (!x.name.startsWith("MainMenu."))
        continue;
      menusInMainMenu.push(x.metadata.Elements.AxMenuExtensionElement.MenuElement.MenuName)
    }

    let parseMenu = curMenu => {
      if(curMenu.Elements !== undefined){
        return {
          type: "submenu", 
          name: curMenu.Name, 
          label: curMenu.Label, 
          items: curMenu.Elements ? Array.isArray(curMenu.Elements.AxMenuElement) ? curMenu.Elements.AxMenuElement.filter(m => m.Name != "Workspaces").map(m => parseMenu(m)) : [parseMenu(curMenu.Elements.AxMenuElement)] : []
        }
      } else {
        let typeName = "menuitemdisplay"
        switch(curMenu.MenuItemType){
          case "Action":
            typeName = "menuitemaction";
            break;
          case "Output":
            typeName = "menuitemoutput";
            break;
        }
        let mi = Element.lookupType(typeName, curMenu.Name)
        return {
          type: "menuitem", 
          name: curMenu.Name, 
          label: mi?.metadata.Label || curMenu.Name,
          object: mi?.metadata.Object
        }
      }
    }

    for(let name of menusInMainMenu){
      let curMenu = menus.find(m => m.name == name)
      if(!curMenu)
        continue;
      
      menu.push(parseMenu(curMenu.metadata))
    }

    menu.push({
      type: "fixedsubmenu",
      label: "System",
      items: [
        {type: "fixeditem", label: "Users", page: "/setup/users"},
        {type: "fixeditem", label: "Setup", page: "/system"},
        {type: "fixeditem", label: "Tools", page: "/systemtools"}
      ]
    })

    return menu;
  }

  async getLabels(){
    
    let labelFiles = Element.search("tag:element prop:type=labelfile prop:language=da");
    let ret = {}
    for(let file of labelFiles)
      Object.assign(ret, JSON.parse(await this.streamToString(file.blob)))
    return ret
  }

  async streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      /*
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      */
      stream.setEncoding('utf8');
      stream.on('data', data => resolve(data))
      stream.on('end', () => console.log("Done"))
    })
  }
}



module.exports = new Service()