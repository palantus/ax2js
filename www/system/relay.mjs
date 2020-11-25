
import relay from "https://relay.axman.dk/client.mjs"
import {getUser, getToken} from "/system/api.mjs"

function create(){
  relay.login({id: getUser().id, key: getToken()}).then((user) => {
    console.log("Relay: Logged in as " + user.id)
  })

  relay.addEventListener('disconnected', () => console.log("Relay: Disconnected"))
  relay.addEventListener('connected', () => console.log("Connected - not logged in"))
  relay.addEventListener('error', ({detail: errorText}) => console.log(errorText))
  return relay;
}

export default create();
