import config from '../config'
import Nl2br from "vue-nl2br";

//import firebase from "firebase/app";
//import "firebase/firestore";
//import "firebase/firebase-auth";
//import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import VueResizeText from "vue-resize-text"
//import { Notify } from 'quasar'
import VueVideoSection from 'vue-video-section'
//import VueFuse from 'vue-fuse'
import PouchDB from 'pouchdb-browser'
import find from 'pouchdb-find'
import livefind from 'pouchdb-live-find'
import auth from 'pouchdb-authentication'
import VueSocketIO from 'vue-socket.io'
PouchDB.plugin(find);
PouchDB.plugin(livefind);
PouchDB.plugin(auth);



require('vue2-animate/dist/vue2-animate.min.css')
import electron from 'electron'
const {
  ipcRenderer
} = electron;

import {
  ws_helpers
} from "../helpers/ws.js";
//import db from "../helpers/firebase"

import wavesurfer from 'wavesurfer.js'

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


  Vue.use(new VueSocketIO({
    debug: true,
    connection: config.socket_server
}))

  Vue.use(VueResizeText)

  Vue.prototype.$mode = "chords";
  Vue.prototype.$ws = ws_helpers;
  Vue.prototype.$config = config;
  Vue.prototype.$store = store;
  Vue.prototype.$renderer = ipcRenderer;
  //Vue.prototype.$firebase = db;
  //Vue.prototype.$firestore = db.firestore();
  Vue.prototype.$wavesurfer = wavesurfer;
  Vue.prototype.$peers = {}
  Vue.prototype.$bus = new Vue()
  Vue.prototype.$moment = require('moment');
  Vue.prototype.$ver = "1.0.3"
  Vue.prototype.$pouchRemoteSongs = new PouchDB(config.db_remote_songs,{skip_setup:true})
  Vue.prototype.$pouchRemotePlaylists = new PouchDB(config.db_remote_playlists,{skip_setup:true})
  Vue.prototype.$pouchPlaylists = new PouchDB('savedplaylists')
  Vue.prototype.$pouchSongs = new PouchDB('songs')
  Vue.prototype.$pouchSongsPref = new PouchDB('songsPrefs')
  Vue.prototype.$pouchApp = new PouchDB('app')
  Vue.prototype.$pouchSongs.createIndex({
    index:{
      fields:['searchref'],
      ddoc: "searchrefindex"
    }
  })
  Vue.prototype.$pouchSongsPref.createIndex({
    index:{
      fields:['songID']
    }
  })
  Vue.prototype.$pouchApp.createIndex({
    index:{
      fields:['objectType']
    }
  })
 
  Vue.prototype.$pouchRemoteSongs.logIn(config.db_username,config.db_password).then(status=>{
    console.log("STATUS SONG", status)
  })
  Vue.prototype.$pouchRemotePlaylists.logIn(config.db_username,config.db_password).then(status=>{
    console.log("STATUS PLAYLISTS", status)
  })
    
  ws_helpers.sync().then(()=>console.log('FIRST SYNC'))
  ws_helpers.versionControl();
  sessionStorage.setItem('playlist',JSON.stringify({name:null,items:[],id:null}))

};
