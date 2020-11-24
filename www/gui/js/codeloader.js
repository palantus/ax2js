"use strict"

function Info(t){console.log(t)} //TODO: fjern når Global kan kompileres

class CodeLoader{
  constructor(){
    this.loadedIds = [];
  }

  // Get all code for running specific element:
  loadDependencies(id, cb){
    var self = this;
    $.get("/api/element/" + id + "/depsource", function(response){
      for(let i in response){
        if(self.loadedIds.indexOf(response[i].id) < 0 && response[i].jsSource !== undefined && response[i].name != "Global"){ //TODO: Fjern Global
          console.log("Loading " + response[i].type + " " + response[i].name)
          eval.apply(null, [response[i].jsSource]); //Load in global scope
        }
      }
      cb();
    })
  }
}


$(function() {
  // TODO: fjern hardcoded id og call
  new CodeLoader().loadDependencies(3, function(){
    new SPBusinessLogic().fillShows()
  })
})
