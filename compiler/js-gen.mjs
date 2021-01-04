import Entity from 'entitystorage'
import ClassGen from './js-classgen.mjs'

class Compiler{
  compile(e){
    this.e = e

    switch(e.type){
      case "class":
        break;

      default:
        return;
    }

    this.gen = new ClassGen(e, e.name);
    this.compileDeclaration();
    
    e.sourceJS = this.gen.generate();
  }

  compileDeclaration(){

  }
}

export function compileElement(e){
  new Compiler().compile(e)
}