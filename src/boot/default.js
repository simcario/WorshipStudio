import Nl2br from "vue-nl2br";
import firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/firebase-auth";
import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import VueResizeText from "vue-resize-text"
import { Notify } from 'quasar'
import VueVideoSection from 'vue-video-section'
import VueFuse from 'vue-fuse'
 


require('vue2-animate/dist/vue2-animate.min.css')
import electron from 'electron'
const {
  ipcRenderer
} = electron;

import {
  ws_helpers
} from "../helpers/ws.js";
import db from "../helpers/firebase"

import wavesurfer from 'wavesurfer.js'

// TODO: from localstorage
const config = {
  language: "en", //TODO
  notation: "latin" // anglo or latin
};

// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import {
  VUEJS_DEVTOOLS
} from "electron-devtools-installer";

// "async" is optional
export default ({
  Vue,
  store
}) => {
  Vue.component("nl2br", Nl2br);
  Vue.component("vue-draggable-resizable", VueDraggableResizable);
  Vue.use(require('vue-shortkey'))
  Vue.use(VueResizeText)
  Vue.use(VueFuse)
  Vue.component('vue-video-section', VueVideoSection)
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
  Vue.prototype.$wavesurfer = wavesurfer;
  Vue.prototype.$peers = {}
  Vue.prototype.$bus = new Vue()
  Vue.prototype.$ver = "1.0.3"

 
    

  const pcName = store.getters["defaultModule/getComputerName"]

  ws_helpers.loadAllSongs()

  ipcRenderer.on('newPeer', (event, peerName) => {
    Notify.create({
      message:'New peer ' + peerName,
      color:'primary',
      icon:'fas fa-user',
      position:'bottom-right'
    })
    
  })


  ipcRenderer.on('peers', (event, peers) => {
  
    Vue.prototype.$peers = peers
  })


  ws_helpers.versionControl();

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
