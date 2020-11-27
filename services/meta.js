
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
      if(curMenu.Elements){
        return {
          type: "submenu", 
          name: curMenu.Name, 
          label: curMenu.Label, 
          items: Array.isArray(curMenu.Elements.AxMenuElement) ? curMenu.Elements.AxMenuElement.map(m => parseMenu(m)) : [parseMenu(curMenu.Elements.AxMenuElement)]
        }
      } else {
        let mi = Element.lookupType("menuitemdisplay", curMenu.Name)
        return {
          type: "menuitem", 
          name: curMenu.Name, 
          label: mi?.metadata.Label,
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
}

module.exports = new Service()