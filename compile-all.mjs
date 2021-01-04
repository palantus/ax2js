import {genAST} from "./compiler/ast-gen.mjs"
import {compileElement} from "./compiler/js-gen.mjs"
import Entity from "entitystorage"

Entity.init("./data").then(() => {
  //let elements = Entity.search(`tag:tablefunction`)
  let elements = [Entity.find("tag:classfunction element.prop:name=AhkPetHelper")]
  elements.forEach(e => genAST(e))

  elements = [Entity.find("tag:class prop:name=AhkPetHelper")]
  elements.forEach(e => compileElement(e))
})
