import {genAST, initASTParser} from "./compiler/ast-gen.mjs"
import {compileElement, initJSCompiler} from "./compiler/js-gen.mjs"
import Entity from "entitystorage"

Promise.all([
  Entity.init("./data"),
  initASTParser(),
  initJSCompiler()
]).then(() => {
  
  // Generate AST:
  Entity.search("xpp.tag:xpp element.prop:name=^AhkPet").forEach(e => genAST(e))

  // Compile to Javascript:
  Entity.search("prop:name=^AhkPet (tag:form|tag:table|tag:class)").forEach(e => compileElement(e))
})
