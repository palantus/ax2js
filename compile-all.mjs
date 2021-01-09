import {genAST, initASTParser, status} from "./compiler/ast-gen.mjs"
import {compileElement, initJSCompiler} from "./compiler/js-gen.mjs"
import Entity from "entitystorage"

Promise.all([
  Entity.init("./data"),
  initASTParser(),
  initJSCompiler()
]).then(() => {
  
  // Generate AST:
  Entity.search("xpp.tag:xpp element.prop:name=^AhkPet").forEach(e => genAST(e))
  let s = status()
  console.log(`Generated AST for ${s.success} of ${s.total} functions. The remaining ${s.failed} failed.`)

  // Compile to Javascript:
  Entity.search("prop:name=^AhkPet (tag:form|tag:table|tag:class)").forEach(e => compileElement(e))
})
