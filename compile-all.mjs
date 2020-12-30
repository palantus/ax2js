import {genAST} from "./compiler/ast-gen.mjs"
import Entity from "entitystorage"

Entity.init("./data").then(() => {
  //Entity.search(`tag:tablefunction`).forEach(e => genAST(e))
  genAST(Entity.find("tag:classfunction element.prop:name=AhkPetHelper"))
})
