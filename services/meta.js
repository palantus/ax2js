
let Element = require("../../models/element")

class Service{
  genMenu(){
    let menu = {}
    let ext = Element.search("tag:element prop:type=menuextension")
    let menus = Element.search("tag:element prop:type=menu")

    let menusInMainMenu = []
    for (let x of ext) {
      if (!x.name.startsWith("MainMenu."))
        continue;
      menusInMainMenu.push(x.metadata.Elements.AxMenuExtensionElement.MenuElement.MenuName)
    }

    for(let name of menusInMainMenu){
      let curMenu = menus.find(m => m.name == name)
      if(!curMenu)
        continue;
      
      let parseMenu = e => {
        if(e.Elements){
          let ret = {}
          //for(let ie of e.Elements)
            //ret[ie.AxMenuElement.Label]

          //TODO: finish
        } else {

        }
      }
      //menu[curMenu.metadata.Label] = 
    }
    return menu;
  }
}

module.exports = new Service()