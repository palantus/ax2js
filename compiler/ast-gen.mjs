import Parser from "./ast-gen-compiler.mjs";
import Entity from "entitystorage"

export function genAST(func){
  //try{
    func.rels.ast?.forEach(e => e.delete())
    let sourceXPP = func.related.xpp?.source
    func.rel(new Entity().tag("ast").prop("source", Parser.parser.parse(sourceXPP)), "ast")
    
  /*} catch(err){
    
  }*/
}