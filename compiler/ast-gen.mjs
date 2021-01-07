import Entity from "entitystorage"
import {readFile} from "fs"
import jison from "jison"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let parser;

export async function initASTParser(){
  let bnf = await new Promise((r) => readFile(join(__dirname, "source/xpp2ast.jison"), "utf8", (err, data) => r(data)));
  parser = new jison.Parser(bnf);
}

export function genAST(func){
  //try{
    console.log(`Generating AST for ${func.related.element.type} ${func.related.element.name}.${func.name}`)

    func.rels.ast?.forEach(e => e.delete())
    let sourceXPP = func.related.xpp?.source
    func.rel(new Entity().tag("ast").prop("source", parser.parse(sourceXPP)), "ast")
    
  /*} catch(err){
    
  }*/
}