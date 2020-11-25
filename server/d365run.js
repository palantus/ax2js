const d365Reader = require("./d365Reader")
let Entity = require("entitystorage")

let run = async () => {
  await Entity.init("./data");
  Entity.search("tag:element").delete();
  new d365Reader().readFolder("server/input/metadata/PetStore")
}
run();