import {genAST} from "./compiler/ast-gen.mjs"
import {compileElement} from "./compiler/js-gen.mjs"
import Entity from "entitystorage"

Entity.init("./data").then(() => {
  //let elements = Entity.search(`tag:tablefunction`).map(e => e.related.xpp)
  let elements = Entity.search("xpp.tag:xpp element.prop:name=AhkPetHelper")
  elements.forEach(e => genAST(e))

  elements = [Entity.find("tag:class prop:name=AhkPetHelper")]
  elements.forEach(e => compileElement(e))
})
