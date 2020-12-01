let elementName = "topbar-component"

import {state, projects} from "../system/core.mjs"
import {on, off, fire} from "../system/events.mjs"
import { changeProject } from "../system/core.mjs";
import "/components/notification.mjs";
import LD2Reader from "../system/ld2reader.mjs"
import {setReader} from "../system/data.mjs"

const template = document.createElement('template');
template.innerHTML = `
  <style>
    img{
        position: fixed;
        cursor: pointer;
    }

    img.profile{
        width: 26px;
        filter: grayscale(100%);
        right: 10px;
        top: 4px;
    }
    img.profile:hover{
        filter: grayscale(80%);
    }

    img.noti{
        filter: invert(1);
        right: 48px;
        width: 22px;
        top: 4px;
    }
    img.noti:hover{
        filter: invert(80%);
    }
    #fileinput{
      position: fixed;
      right: 83px;
      top: 5px;
      color: white;
      /*width: 75px;*/
    }
    
    #log{
      position: fixed;
      right: 185px;
      top: 6px;
      width: 75px;
      text-align: right;
      font-size: 120%;
      width: 100%;
      opacity: 1;
      transition: opacity 200ms;
    }
    #log[level="info"]{
      color: #eee;
    }
    #log[level="error"]{
      color: #f00;
    }
    #log.hidden{
      opacity: 0;
    }

    #notifications{
      display: none;
      background: rgba(0, 0, 0, 0.65);
      /*border-radius: 0px 0px 0px 8px;*/
      padding: 8px;
      min-height: 100px;
      min-width: 300px;
      position: absolute;
      right: 0px;
      top: 35px;
      border: 1px solid gray;
      box-shadow: -5px 5px 15px #ccc;
      overflow: auto;
      max-height: 80vh;
    }
    @supports (backdrop-filter: blur(5px)) {
      #notifications {
        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(5px);
      }
    }
    #notifications.shown{
      display: block;
    }
    #container{
      position: relative;
      z-index: 10;
    }
    notification-component:not(:last-child){
      margin-bottom: 10px;
    }
  </style>

  <div id="container">
    <span id="log" class="hidden"></span>
    <input type="file" id="fileinput" />
    </select>
    <img class="noti" id="noti-toggle" src="/img/bell.png" alt="Notifications" title="Notifications"/>
    <img class="profile" src="/img/profile.png" alt="Profile" title="Profile"/>

    <div id="notifications">
      <notification-component title="Test 1" timestamp="1/1-2020 14:59">First notification</notification-component>
      <notification-component title="Test 2">Second notification</notification-component>
      <notification-component title="Test 3">Third notification</notification-component>
    </div>
  </div>
`;

class Element extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.clearCurLogItem = this.clearCurLogItem.bind(this); //Make sure "this" in that method refers to this
    this.readSingleFile = this.readSingleFile.bind(this); //Make sure "this" in that method refers to this

    this.shadowRoot.getElementById("noti-toggle").addEventListener("click", () => {
      this.shadowRoot.getElementById("notifications").classList.toggle("shown")
    })

    this.shadowRoot.getElementById('fileinput').addEventListener('change', this.readSingleFile, false);
  }

  readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];
  
    if (f) {
      let ext = f.name.substring(f.name.lastIndexOf('.'))
  
      let r = new FileReader();
      r.onload = (e) => this.onFile(e, f.name, ext);
  
      switch(ext.toLowerCase()){
        case ".ld2":
            r.readAsArrayBuffer(f);
            break;
        default:
          alert(`Unknown file extension ${ext}`)
          return;
      }
    } else {
      alert("Failed to load file");
    }
  }

  async onFile(e, filename, ext){
    let buffer = e.target.result;
    let reader;
    switch(ext.toLowerCase()){
      case ".ld2":
          reader = new LD2Reader(buffer);
          break;
      default:
        alert(`Unknown file extension ${ext}`)
        return;
    }
  
    await reader.read();
    setReader(reader)
  }

  connectedCallback() {
    on("log", "topbar", (message) => {
      clearTimeout(this.logTimeout)
      this.shadowRoot.getElementById("log").classList.remove("hidden")
      let msg = typeof message === "object" ? message : {level: "info", message}
      msg.level = msg.level || "info"
      this.shadowRoot.getElementById("log").setAttribute("level",  msg.level == "error" ? "error" : "info")
      this.shadowRoot.getElementById("log").innerText = msg.message
      this.logTimeout = setTimeout(this.clearCurLogItem, 5000)
    })
  }

  clearCurLogItem(){
    this.shadowRoot.getElementById("log").classList.add("hidden")
  }

  disconnectedCallback() {
    off("log", "topbar")
  }
}


window.customElements.define(elementName, Element);
export {Element, elementName as name}