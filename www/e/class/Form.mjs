import FormBuildDesign from "./FormBuildDesign.mjs";

export default class Form{
  addDesign(name){
    return new FormBuildDesign(name)
  }
}