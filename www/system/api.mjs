import {state} from "./core.mjs"
import {on, fire} from "./events.mjs"

class API{

    constructor(){
        this.setToken()
        on("changed-project", "api", () => {
          this.failedLoginState = false;
          this.setToken()
        })
    }

    setToken(){
      let urlToken = state().query.token
      let tokenKey = `${state().project}_apitoken`
      if(urlToken){
          this.token = urlToken;
          localStorage.setItem(tokenKey, this.token)
      } else {
          this.token = localStorage.getItem(tokenKey)
      }

      if(this.token){
        this.failedLoginState = false;
        this.tokenPayload = parseJwt(this.token)
      } else {
        if(state().query.success == "false"){
          alert("Could not sign in to project " + state().project)
          this.failedLoginState = true;
        } else {
          this.login();
        }
      }
    }

    async get(path, options){
        if(this.failedLoginState === true) return;

        options = options || {}
        let res = await fetch(`https://${state().project}/${path}`, {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }})
        if(res.status < 300 || options.returnIfError === true){
            return await res.json();
        } else if(res.status == 403){
            this.login()
        } else if(res.status >= 400 && res.status < 500){
            alert("Server fejl")
            console.log(await res.text())
            //checkUser();
            /*
            await checkUser();
            await new Promise(r => setTimeout(() => r(), 500))
            if(options.retryCount > 3)
                toast(`Forespørgslen kunne ikke udføres pga. rettighedsproblemer. Fejlinformation: ${res.status}; ${res.statusText}`)
            else {
                return await this.get(path, options)
            }
            */
        } else {
            toast(`Forespørgslen kunne ikke udføres. Fejlinformation: ${res.status}; ${res.statusText}`)
        }
    }
    async post(path, data){
      if(this.failedLoginState === true) return;
      let res = await fetch(`https://${state().project}/${path}`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + this.token
          }
      })
      if(res.status < 300){
        return await res.json();
      } else if(res.status == 403){
        this.login()
      } else if(res.status >= 400/* && res.status < 500*/){
        let retObj = await res.json()
        console.log(`${res.status}: ${res.statusText}`, retObj)
        fire("log", {level: "error", message: retObj.message})
        throw retObj.message
      }
    }
    async del(path){
      if(this.failedLoginState === true) return;
      return await(await fetch(`https://${state().project}/${path}`, 
          {
            method: "DELETE",
            headers: { 
              "Authorization": "Bearer " + this.token
            }
          })).json()
    }

    async query(query, variables){
      if(this.failedLoginState === true) return;
      let res = await fetch(`https://${state().project}/graphql`, {
          method: 'POST',
          headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + this.token
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      })
      
      /*
      // Changed to GET request to help service worker cache result
      let url = `https://${state().project}/graphql?query=${encodeURI(query)}&variables=${variables?encodeURI(JSON.stringify(variables)):""}`
      let res = await fetch(url, {
          headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
          }
      })
      */
      if(res.status < 300){
          res = await res.json()
          if(res.data)
              return res.data
          else
              return res;
      } else if(res.status == 403){
          this.login()
      } else if(res.status == 400){
          console.log(await res.json())
      } else {
          console.log(`${res.status}: ${res.statusText}`)
      }
    }

    login(){
        let redirectUrl = window.location.href;
        window.location = `https://${state().project}/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
    }
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

let api = new API()

export default api
export function getToken(){return api.token}
export function getUser(){return api.tokenPayload}