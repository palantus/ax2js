const elementName = 'user-page'

import api from "/system/api.mjs"
import "/components/action-bar.mjs"
import "/components/action-bar-item.mjs"
import "/components/field.mjs"
import {on, off, fire} from "/system/events.mjs"
import {state} from "/system/core.mjs"
import {showDialog} from "/components/dialog.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <link rel='stylesheet' href='/css/global.css'>
  <style>
    #container{
        padding: 10px;
        position: relative;
    }
    
  </style>  

  <action-bar>
      <action-bar-item id="save-btn">Save</action-bar-item>
      <action-bar-item id="msuser-btn">Assign to MS user</action-bar-item>
  </action-bar>

  <div id="container">
    <h3>User <span id="user-id"></span></h3>

    <field-component label="Name"><input id="user-name"></input></field-component>

    <br/>
    <h3>Microsoft users:</h3>
    <div id="msusers"></div>

    <dialog-component title="Assign user to MS user" id="msuser-dialog">
      <field-component label="MS email or id"><input list="emails" id="msuser-email"></input></field-component>
    </dialog-component>

    
  <datalist id="emails">
  </datalist>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.save = this.save.bind(this); //Make sure "this" in that method refers to this
    this.assignToMSUser = this.assignToMSUser.bind(this); //Make sure "this" in that method refers to this
    
    this.shadowRoot.querySelector("#save-btn").addEventListener("click", this.save)

    this.refreshData(/\/setup\/users\/([a-z]+)/.exec(state().path)[1]);
    this.shadowRoot.querySelector("#msuser-btn").addEventListener("click", this.assignToMSUser)
  }

  async save(){
    await api.query(`
      mutation updateName($id: String!, $name: String!){
        setUserName(id:$id, name: $name){
          id
        }
      }
    `, {id: this.userId, name: this.shadowRoot.getElementById("user-name").value})
    
    fire("log", "User saved")
  }

  async assignToMSUser(){
    let dialog = this.shadowRoot.querySelector("#msuser-dialog")

    api.query(`{
      unassignedMSUsers{
        email
      }
    }`).then(data => {
      this.shadowRoot.getElementById("emails").innerHTML = data.unassignedMSUsers.map(u => `<option>${u.email}</option>`).join("");
    })

    showDialog(dialog, {
      show: () => this.shadowRoot.querySelector("#msuser-email").focus(),
      ok: async (val) => {
        let res = await api.post(`user/${this.userId}/assignToMSAccount/${val.email}`, val)
        if(res?.error){
          fire("log", {level: "error", message: res.error})
          return;
        }
        this.refreshData()
      },
      validate: (val) => 
          !val.email ? "Please fill out email"
        : true,
      values: () => {return {
        email: this.shadowRoot.getElementById("msuser-email").value
      }},
      close: () => {
        this.shadowRoot.querySelectorAll("field-component input").forEach(e => e.value = '')
      }
    })
  }

  async refreshData(id = this.userId){
    this.userId = id;

    try{
      let user = await api.get(`user/${id}`)
      this.shadowRoot.getElementById("user-id").innerText = user.id;
      this.shadowRoot.getElementById("user-name").value = user.name;
      this.shadowRoot.getElementById("msusers").innerHTML = user.msUsers.map(u => u.email).join("<br/>")
    } catch(err){
      console.log(err)
      alert("could not retrive user")
      return;
    }
  }

  connectedCallback() {
    on("changed-project", "user", ({query}) => this.refreshData())
  }

  disconnectedCallback() {
    off("changed-project", "user")
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}