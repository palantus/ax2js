const elementName = 'system-page'

import api from "/system/api.mjs"
import "/components/action-bar.mjs"
import "/components/action-bar-item.mjs"
import "/components/field.mjs"
import {fire, on, off} from "/system/events.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <link rel='stylesheet' href='/css/global.css'>
  <style>
    #container{
        padding: 10px;
        position: relative;
    }
    div.group:not(:first-child){
      margin-top: 10px;
    }
    .group input{
      width: 350px;
    }
  </style>  

  <action-bar>
      <action-bar-item id="save-btn">Save</action-bar-item>
  </action-bar>

  <div id="container">

    <div id="group-flags" class="group">
      <h2>Feature flags</h2>
      <field-component label="Azure"><input type="checkbox" id="flag-azure"></input></field-component>
      <field-component label="Issue tasks"><input type="checkbox" id="flag-tasks"></input></field-component>
      <field-component label="Relay events"><input type="checkbox" id="flag-relay"></input></field-component>
    </div>

    <div id="group-azure" class="group" style="display: none">
      <h2>Azure</h2>
      <field-component label="Client Id"><input type="text" id="azure-client-id"></input></field-component>
      <field-component label="Tenant Id"><input type="text" id="azure-tenant-id"></input></field-component>
      <field-component label="Secret"><input type="password" id="azure-secret-id"></input></field-component>
      <field-component label="Subscription"><input type="text" id="azure-subscription-id"></input></field-component>
    </div>

    <div id="group-relay" class="group" style="display: none">
      <h2>Relay</h2>
      <field-component label="URL"><input type="text" id="relay-URL"></input></field-component>
      <field-component label="User Id"><input type="text" id="relay-user-id"></input></field-component>
      <field-component label="Key"><input type="password" id="relay-key"></input></field-component>
    </div>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.save = this.save.bind(this); //Make sure "this" in that method refers to this
    this.refreshData = this.refreshData.bind(this); //Make sure "this" in that method refers to this
    this.refreshFields = this.refreshFields.bind(this); //Make sure "this" in that method refers to this
    
    this.shadowRoot.querySelector("#save-btn").addEventListener("click", this.save)

    this.refreshData();
  }

  async save(){
    await api.query(`
      mutation systemUpdate($input: SystemInputType!){
        systemUpdate(input:$input){
          azureClientId
        }
      }
    `, {
      input: {
        azureClientId: this.shadowRoot.getElementById("azure-client-id").value || null,
        azureTenant: this.shadowRoot.getElementById("azure-tenant-id").value || null,
        azureSecret: this.shadowRoot.getElementById("azure-secret-id").value || null,
        azureSubscriptionId: this.shadowRoot.getElementById("azure-subscription-id").value || null,
        relayURL: this.shadowRoot.getElementById("relay-URL").value || null,
        relayUserId: this.shadowRoot.getElementById("relay-user-id").value || null,
        relayKey: this.shadowRoot.getElementById("relay-key").value || null,
        flags:{
          azure: this.shadowRoot.getElementById("flag-azure").checked ? true : false,
          tasks: this.shadowRoot.getElementById("flag-tasks").checked ? true : false,
          relay: this.shadowRoot.getElementById("flag-relay").checked ? true : false,
        }
      }
    })
    
    fire("log", "System saved")
  }

  refreshFields(){
    this.shadowRoot.getElementById("group-azure").style.display = this.shadowRoot.getElementById("flag-azure").checked ? "block" : "none"
    this.shadowRoot.getElementById("group-relay").style.display = this.shadowRoot.getElementById("flag-relay").checked ? "block" : "none"
  }

  async refreshData(){

    try{
      let {system} = await api.query(`{
        system{
          azureClientId,
          azureTenant,
          azureSecret,
          azureSubscriptionId,
          relayURL,
          relayUserId,
          relayKey,
          flags{
            azure,
            tasks,
            relay
          }
        }
      }`)
      this.shadowRoot.getElementById("flag-tasks").checked = system.flags.tasks;
      this.shadowRoot.getElementById("flag-azure").checked = system.flags.azure;
      this.shadowRoot.getElementById("flag-relay").checked = system.flags.relay;

      this.shadowRoot.getElementById("azure-client-id").value = system.azureClientId || "";
      this.shadowRoot.getElementById("azure-tenant-id").value = system.azureTenant || "";
      this.shadowRoot.getElementById("azure-secret-id").value = system.azureSecret || "";
      this.shadowRoot.getElementById("azure-subscription-id").value = system.azureSubscriptionId || "";

      this.shadowRoot.getElementById("relay-URL").value = system.relayURL || "";
      this.shadowRoot.getElementById("relay-user-id").value = system.relayUserId || "";
      this.shadowRoot.getElementById("relay-key").value = system.relayKey || "";

      this.refreshFields()
    } catch(err){
      console.log(err)
      alert("could not retrive system")
      return;
    }
  }

  connectedCallback() {
    on("changed-project", elementName, this.refreshData)
    on("changed-page", elementName, this.refreshData)
    this.shadowRoot.getElementById("group-flags").addEventListener("change", this.refreshFields)
  }

  disconnectedCallback() {
    off("changed-project", elementName)
    off("changed-page", elementName)
    this.shadowRoot.getElementById("group-flags").removeEventListener("change", this.refreshFields)
  }
}

window.customElements.define(elementName, Element);
export {Element, elementName as name}