import Parser from "./ast-gen-compiler.mjs";

export function genAST(func){
  //try{
    func.sourceAST = Parser.parser.parse(func.sourceXPP);
  /*} catch(err){
    
  }*/
}