import Nl2br from "vue-nl2br";
import firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/firebase-auth";
import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable";

import electron from 'electron'
const {ipcRenderer} = electron;

import { ws_helpers } from "../helpers/ws.js";
import db from "../helpers/firebase"

// TODO: from localstorage
const config = {
  language: "en", //TODO
  notation: "latin" // anglo or latin
};

// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import { VUEJS_DEVTOOLS } from "electron-devtools-installer";

// "async" is optional
export default ({ Vue, store }) => {
  Vue.component("nl2br", Nl2br);
  Vue.component("vue-draggable-resizable", VueDraggableResizable);

  
  const loginInfo = {
    loggedIn: store.getters["defaultModule/getLoggedIn"],
    organizationName: store.getters["defaultModule/getOrganizationName"],
    organizationID: store.getters["defaultModule/getOrganizationID"],
    startModule: store.getters["defaultModule/getStartModule"],
    email: store.getters["defaultModule/getEmail"],
    displayName: store.getters["defaultModule/getDisplayName"]
  };

  Vue.prototype.$loginInfo = loginInfo;
  Vue.prototype.$mode = "chords";
  Vue.prototype.$ws = ws_helpers;
  Vue.prototype.$config = config;
  Vue.prototype.$store = store;
  Vue.prototype.$renderer = ipcRenderer;
  Vue.prototype.$firebase = db;
  Vue.prototype.$firestore = db.firestore();
 
  Vue.prototype.$bus = new Vue()
 
  const pcName = store.getters["defaultModule/getComputerName"]

  ipcRenderer.send('pc-name',pcName);
  

 
  ipcRenderer.on('yourIP',(event,data)=>{
    Vue.prototype.$localIP = data
   // console.log("IP",data)
  })
  ipcRenderer.send('myIP')

 
  ws_helpers.checkInternetConnection().then(res => {
    store.dispatch("defaultModule/internetStatus", res).then(() => {});
  });
  setInterval(() => {
    ws_helpers.checkInternetConnection().then(res => {
      store.dispatch("defaultModule/internetStatus", res).then(() => {});
    });
  }, 10000);

  ws_helpers.checkLicenseExpiration().then(res => {
    store.dispatch("defaultModule/licenseExpired", res).then(() => {});
  });

 
};
