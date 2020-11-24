const d365Reader = require("./d365Reader")
let Entity = require("entitystorage")

let run = async () => {
  await Entity.init("./data");
  new d365Reader().readFolder("server/input/metadata/LessorIntegration/LessorIntegration")
}
run();