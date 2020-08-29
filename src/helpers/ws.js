import Vue from "vue";
import axios from "axios";
import SimpleCrypto from "simple-crypto-js";
import { Notify } from "quasar";
import {version} from '../../package.json'

const bus = new Vue();

export const ws_helpers = {
  getPreferences() {
    var uniqid = require("uniqid");
    return new Promise(res => {
      Vue.prototype.$pouchApp
        .find({
          selector: {
            objectType: "preferences"
          }
        })
        .then(data => {
          if (data.docs.length > 0) {
            res(data.docs[0]);
          } else {
            let pref = {
              objectType: "preferences",
              data: {
                showChords: true,
                startModule: "Chords",
                computerName: uniqid("DESKTOP-"),
                language: "en",
                notation: "anglo"
              }
            };
            Vue.prototype.$pouchApp.post(pref);
            res(pref);
          }
        });
    });
  },
  currentTime() {
    var moment = require("moment");
    return moment().format();
  },
  createAlert(message) {
    Notify.create({
      message: message,
      color: "positive",
      icon: "fas fa-info",
      textColor: "white",
      position: "bottom"
    });
  },
  getLicense() {
    return new Promise(res => {
      Vue.prototype.$pouchApp
        .find({
          selector: {
            objectType: "licenseInfo"
          }
        })
        .then(docs => {
          console.log(docs)
          if (docs.docs.length > 0) {
            res(docs.docs[0].data);
          } else {
            res({
              licenseID: "907e73c8e4fc4c0fc114922aa9005eea",
              orgName: "Demo",
              orgEmail: "demo@worshipstudio.app",
              licenseType: "demo",
              licenseExpiration: "2025-12-31"
            });
          }
        });
    });
  },
  loadLocalResource(docId, propertyName) {
    return new Promise(res => {
      Vue.prototype.$pouchSongsPref
        .find({
          selector: { songID: docId }
        })
        .then(doc => {
          if (propertyName !== undefined) {
            doc !== undefined &&
            doc.docs[0] !== undefined &&
            doc.docs[0][propertyName] !== undefined
              ? res(doc.docs[0][propertyName])
              : res(null);
          } else {
            doc !== undefined && doc.docs[0] !== undefined
              ? res(doc.docs[0])
              : res(null);
          }
        })
        .catch(err => res(err));
    });
  },
  allSongs(str) {
    return new Promise(res => {
      Vue.prototype.$pouchSongs
        .find({
          selector: {
            searchref: { $regex: str.toLowerCase() }
          },
          sort: ["searchref"],
          use_index: "searchrefindex"
        })
        .then(songs => {
          res(songs.docs);
        });
    });
  },
  getSong(id) {
    return new Promise(res => {
      Vue.prototype.$pouchSongs.get(id).then(doc => {
        res(doc);
      });
    });
  },
  sync() {
    let sync = false;
    let sync2 = false;
    return new Promise(resolve => {
      Vue.prototype.$bus.$emit("status", {
        message: "Synchronization...",
        color: "yellow",
        textColor: "black"
      });
      this.getLicense().then(licenseInfo => {
        console.log("Sync Songs");

        Vue.prototype.$pouchRemoteApp
          .changes({
            since: "now",
            live: true,
            include_docs: true
          })
          .on("change", function(change) {
            Vue.prototype.$bus.$emit("linkAction", change);
          })
          .on("complete", function(info) {
            console.log("complete", info);
          })
          .on("error", function(err) {
            console.log("error", err);
          });

        console.log("License ID", licenseInfo.licenseID);
        Vue.prototype.$pouchSongs
          .sync(Vue.prototype.$pouchRemoteSongs, {
            live: true,
            retry: true,
            filter: "app/by_license",
            query_params: { licenseID: licenseInfo.licenseID }
          })
          .on("paused", function(info) {
            Vue.prototype.$bus.$emit("status", {
              message: "Synchronization Complete",
              color: "grey",
              textColor: "white"
            });

            console.log("Songs pused");
            if (sync === false) {
              Vue.prototype.$bus.$emit("loadsongs");
              sync = true;
            }

            Vue.prototype.$pouchPlaylists
              .sync(Vue.prototype.$pouchRemotePlaylists, {
                live: true,
                retry: true
              })
              .on("paused", function(info) {
                console.log("Playlist Paused");
                if (sync2 === false) {
                  Vue.prototype.$bus.$emit("loadplaylist");
                  Vue.prototype.$bus.$emit("status", {
                    message: "Synchronization Complete",
                    color: "grey",
                    textColor: "white"
                  });
                  sync2 = true;
                }
                resolve("ok");
              })
              .on("complete", function(info) {
                console.log("Playlist Completed");
                if (sync2 === false) {
                  Vue.prototype.$bus.$emit("loadplaylist");
                  Vue.prototype.$bus.$emit("status", {
                    message: "Synchronization Complete",
                    color: "grey",
                    textColor: "white"
                  });
                  sync2 = true;
                }
                resolve("ok");
              })

              .on("error", function(err) {
                console.log("Playlist error", err);
              });
          })
          .on("complete", function(err) {
            console.log("Songs Complete");
          })
          .on("error", function(err) {
            console.log("Songs error", err);
          });
      });
    });
  },
  deleteSong(song) {
    return new Promise((res, rej) => {
      song._deleted = true;
      Vue.prototype.$pouchSongs.put(song).then(() => {
        res("ok");
      });
    });
  },
  checkLicense(licenseKey, email) {
    return new Promise((res, rej) => {
      const simpleCrypto = new SimpleCrypto(email);
      try {
        const decryptedKey = simpleCrypto.decrypt(licenseKey);
        console.log(decryptedKey)
        res(decryptedKey);
      } catch(e) {
        console.log(e)
        console.log("ERRORE");
      }
    });
  },
  checkUpdate(){

    return new Promise((res, rej)=>{


      axios("http://www.simonpietro.it/worshipstudio/downloads/version.php")
    .then(({ data }) => {
      let local = version.split(".");
      let remote = data.version.split(".");
      if (
        parseInt(remote[0]) > parseInt(local[0]) ||
        parseInt(remote[1]) > parseInt(local[1]) ||
        parseInt(remote[2]) > parseInt(local[2])
      ) {
        res({
          update:true,
          features:data.new_features
        })
      } else {
        res( {
          update:false
        })
      }
    });

    })

    
  },
  loadFile() {
    return new Promise((res, rej) => {
      axios
        .get("http://localhost:7777/file/test.mp4")
        .then(({ data }) => {
          res(data.internet);
        })
        .catch(error => {
          res("offline");
        });
    });
  },
  updatePlaylist(playlist) {
    //Vue.prototype.$renderer.send("update-playlist", playlist);
    Vue.prototype.$bus.$emit("update-playlist", playlist);
  },
  addToPlaylist(songid) {
    //Vue.prototype.$renderer.send('add-to-playlist', songid)
    Vue.prototype.$bus.$emit("add-to-playlist", songid);
  },
  removeFromPlaylist(index) {
    Vue.prototype.$bus.$emit("remove-from-playlist", index);
    //Vue.prototype.$renderer.send('remove-from-playlist', index)
  },
  savePlaylist(playlist, title) {
    return new Promise((res, rej) => {
      this.getLicense().then(license => {
        if (title === "" || title === null) {
          this.createAlert("Playlist title cannot be empty!");
          res("");
          return;
        }
        if (playlist.items.length === 0) {
          this.createAlert("Cannot save empty playlist!");
          res("");
          return;
        }

        if (playlist._id === undefined) {
          let playlistSave = JSON.parse(JSON.stringify(playlist));
          playlistSave.name = title;
          playlistSave.licenseID = license.licenseID;
          playlistSave.createdBy = license.userName;
          playlistSave.email = license.userEmail;
          playlistSave.sector = license.sector;

          Vue.prototype.$pouchPlaylists.post(playlistSave).then(doc => {
            Vue.prototype.$pouchPlaylists.get(doc.id).then(pl => {
              Vue.prototype.$store.dispatch("defaultModule/setPlaylist", pl);
              res(pl);
            });
          });
        } else {
          let playlistSave = JSON.parse(JSON.stringify(playlist));
          Vue.prototype.$pouchPlaylists.put(playlistSave).then(() => {
            Vue.prototype.$store.dispatch(
              "defaultModule/setPlaylist",
              playlistSave
            );
            res(playlistSave);
          });
        }
        // console.log(playlistData)
        Notify.create({
          message: "Playlist saved",
          color: "positive",
          icon: "fas fa-info",
          textColor: "white",
          position: "bottom"
        });
      });
    });
  },
  removeCloudPlaylist(playlist) {
    return new Promise(res => {
      Vue.prototype.$pouchPlaylists
        .get(playlist._id)
        .then(doc => {
          doc._deleted = true;
          Vue.prototype.$pouchPlaylists.put(doc);
        })
        .then(() => {
          res("ok");
        });
    });
  },
  cloudPlaylists() {
    return new Promise((res, rej) => {
      Vue.prototype.$pouchPlaylists
        .allDocs({ include_docs: true })
        .then(docs => {
          let cloud = [];
          docs.rows.forEach(row => {
            console.log("CLOUD PL:", row);
            let playlist = row.doc;

            cloud.push(playlist);
          });
          res(cloud);
        });
    });
  },
  loadCloudPlaylist(playlist) {
    Notify.create({
      message: "Load selected Cloud Playlist?",
      color: "primary",
      icon: "fas fa-question",
      textColor: "white",
      position: "center",
      actions: [
        {
          label: "Yes",
          color: "yellow",
          handler: () => {
            Vue.prototype.$store.dispatch(
              "defaultModule/setPlaylist",
              playlist
            );
          }
        },
        {
          label: "Dismiss",
          color: "white",
          handler: () => console.log("dismiss")
        }
      ]
    });
  },
  appQuit() {
    Vue.prototype.$renderer.send("app-quit");
  },
  appMinimize() {
    Vue.prototype.$renderer.send("app-minimize");
  },
  versionControl() {
    axios
      .get("https://www.simonpietro.it/worshipstudio/downloads/version.php")
      .then(({ data }) => {
        const remote_version = data.version.split(".");
        const local_version = Vue.prototype.$ver.split(".");
        console.log("NEW UPDATE");
        if (
          parseInt(remote_version[0]) > parseInt(local_version[0]) ||
          parseInt(remote_version[1]) > parseInt(local_version[1]) ||
          parseInt(remote_version[2]) > parseInt(local_version[2])
        ) {
          Vue.prototype.$bus.$emit("new-version", data);
        }
      });
  },
  downloadUpdate() {
    axios({
      url:
        "https://www.simonpietro.it/worshipstudio/downloads/WorshipStudio.exe",
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "WorshipStudio.exe");
      document.body.appendChild(link);
      link.click();
    });
  },
  getSlideBackround(songId, index) {
    let songsLocalSettings =
      JSON.parse(localStorage.getItem("songsLocalSettings")) || {};

    if (
      songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]["slides"][index] !== undefined &&
      songsLocalSettings[songId]["slides"][index]["background"] !== undefined
    ) {
      let background =
        songsLocalSettings[songId]["slides"][index]["background"];
      if (background.backgroundType === "image") {
        let path =
          songsLocalSettings[songId]["slides"][index]["background"].imagePath;
        path = path.replace(/\\/g, "/");
        console.log("path", path);
        return {
          "background-image": "url(file://" + path + ")",
          "background-size": "cover"
        };
      }
      if (background.backgroundType === "color") {
        let bgcolor =
          songsLocalSettings[songId]["slides"][index]["background"]
            .backgroundColor;
        return {
          "background-color": bgcolor
        };
      }
    } else {
      return null;
    }
  },
  getSlideBackgroundInfo(songId, index) {
    let songsLocalSettings =
      JSON.parse(localStorage.getItem("songsLocalSettings")) || {};

    if (
      songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]["slides"][index] !== undefined &&
      songsLocalSettings[songId]["slides"][index]["background"] !== undefined
    ) {
      let background =
        songsLocalSettings[songId]["slides"][index]["background"];
      if (
        background.backgroundType === "image" ||
        background.backgroundType === "video"
      ) {
        let path =
          songsLocalSettings[songId]["slides"][index]["background"].imagePath;
        path = path.replace(/\\/g, "/");

        return {
          backgroundType: background.backgroundType,
          filePath: "file:///" + path
        };
      } else {
        return {
          backgroundType: "",
          filePath: ""
        };
      }
    } else {
      return {
        backgroundType: "",
        filePath: ""
      };
    }
  },
  getSlideTextColor(songId, index) {
    let songsLocalSettings =
      JSON.parse(localStorage.getItem("songsLocalSettings")) || {};

    if (
      songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]["slides"][index] !== undefined
    ) {
      let textColor = songsLocalSettings[songId]["slides"][index].textColor;
      console.log("TEXTCOLOR");
      return {
        color: textColor
      };
    } else {
      return {
        color: "white"
      };
    }
  },
  linkAction(action) {
    //console.log("linkAction", action);
    let actions = {};
    actions[action.action] = {
      songID: action.songID,
      computer: action.computerName
    };
    Vue.prototype.$pouchRemoteApp
      .find({
        selector: {
          sector: action.sector
        }
      })
      .then(docs => {
        if (docs.docs.length === 0) {
          Vue.prototype.$pouchRemoteApp.post({
            sector: action.sector,
            actions: actions
          });
        } else {
          let actionRecord = docs.docs[0];
          actionRecord.actions = actions;
          Vue.prototype.$pouchRemoteApp.put(actionRecord);
        }
      });
  }
};
