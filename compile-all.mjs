import {genAST, initASTParser} from "./compiler/ast-gen.mjs"
import {compileElement, initJSCompiler} from "./compiler/js-gen.mjs"
import Entity from "entitystorage"

Promise.all([
  Entity.init("./data"),
  initASTParser(),
  initJSCompiler()
]).then(() => {
  //let elements = Entity.search(`tag:tablefunction`).map(e => e.related.xpp)
  let elements = Entity.search("xpp.tag:xpp element.prop:name=^AhkPet")
  elements.forEach(e => genAST(e))

  elements = [
    Entity.find("tag:class prop:name=AhkPetHelper"),
    Entity.find("tag:table prop:name=AhkPets")
  ]
  elements.forEach(e => compileElement(e))
})
