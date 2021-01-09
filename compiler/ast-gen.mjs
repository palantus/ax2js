import Entity from "entitystorage"
import {readFile} from "fs"
import jison from "jison-gho"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let parser;
let success = 0, failed = 0, total = 0;

export async function initASTParser(){
  let bnf = await new Promise((r) => readFile(join(__dirname, "source/xpp2ast.jison"), "utf8", (err, data) => r(data)));
  parser = new jison.Parser(bnf);
}

export function genAST(func){
  total++;
  try{
    console.log(`Generating AST for ${func.related.element.type} ${func.related.element.name}.${func.name}`)

    func.rels.ast?.forEach(e => e.delete())
    let sourceXPP = func.related.xpp?.source
    func.rel(new Entity().tag("ast").prop("source", parser.parse(sourceXPP)), "ast")
    success++;
  } catch(err){
    console.log(err)
    failed++;
  }
}

export function status(){
  return {success, failed, total}
}