import {api} from "/system/api.mjs"
import {on} from "/system/events.mjs"

class Setup{

}

let setup = new Setup();

on("system-updated", (system) => {

})

async function refreshData(){
  try{
    let {system} = await api.query(`{
      system{
        azureClientId,
        azureTenant,
        azureSecret,
        azureSubscriptionId,
        flags{
          azure,
          tasks
        }
      }
    }`)

  } catch(err){
    console.log(err)
    alert("could not retrive system")
    return;
  }
}

export default setup;
