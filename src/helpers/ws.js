import Vue from "vue";
import axios from "axios";
import SimpleCrypto from "simple-crypto-js";
import { Notify } from "quasar";

const bus = new Vue();

export const ws_helpers = {
  createAlert(message) {
    Notify.create({
      message: message,
      color: "positive",
      icon: "fas fa-info",
      textColor: "white",
      position: "center"
    });
  },
  today() {
    let d = new Date();

    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  },
  transpose: (txtChords, val) => {
    const chords = {
      anglo: {
        C: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        "C#": ["C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
        Db: ["Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C"],
        D: ["C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"]
      },
      latin: {
        Do: [
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si"
        ],
        "Do#": [
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do"
        ],
        Reb: [
          "Reb",
          "Re",
          "Mib",
          "Mi",
          "Fa",
          "Solb",
          "Sol",
          "Lab",
          "La",
          "Sib",
          "Si",
          "Do"
        ],
        Re: [
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#"
        ],
        "Re#": [
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re"
        ],
        Mib: [
          "Mib",
          "Mi",
          "Fa",
          "Solb",
          "Sol",
          "Lab",
          "La",
          "Sib",
          "Si",
          "Do",
          "Reb",
          "Re"
        ],
        Mi: [
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#"
        ],
        Fa: [
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi"
        ],
        "Fa#": [
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa"
        ],
        Solb: [
          "Solb",
          "Sol",
          "Lab",
          "La",
          "Sib",
          "Si",
          "Do",
          "Reb",
          "Re",
          "Mib",
          "Mi",
          "Fa"
        ],
        Sol: [
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#"
        ],
        "Sol#": [
          "Sol#",
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol"
        ],
        Lab: [
          "Lab",
          "La",
          "Sib",
          "Si",
          "Do",
          "Reb",
          "Re",
          "Mib",
          "Mi",
          "Fa",
          "Solb",
          "Sol"
        ],
        La: [
          "La",
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#"
        ],
        "La#": [
          "La#",
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La"
        ],
        Sib: [
          "Sib",
          "Si",
          "Do",
          "Reb",
          "Re",
          "Mib",
          "Mi",
          "Fa",
          "Solb",
          "Sol",
          "Lab",
          "La"
        ],
        Si: [
          "Si",
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#"
        ]
      }
    };

    let configChords = chords[Vue.prototype.$config.notation];

    const extensions = ["m", "m7", "7", "dim", "sus4", "sus9", "9", "11", "13"];

    const lines = txtChords.split("\n");
    let newline = "";
    lines.forEach(line => {
      const chords = line.split(" ");

      chords.forEach(fullChord => {
        if (fullChord === "") {
          newline += " ";
        } else {
          const chordParts = fullChord.split("/");

          chordParts.forEach((chordPart, index) => {
            let chordExtension = false;
            let chord;
            let newChord;

            extensions.forEach(extension => {
              if (chordPart.indexOf(extension) !== -1) {
                chord = chordPart.replace(extension, "");
                //console.log(chord)
                newChord = configChords[chord][val] + extension;

                newline += newChord;
                chordExtension = true;
              }
            });
            // console.log(chordPart);

            if (chordExtension === false) {
              newChord = configChords[chordPart][val];
              newline += newChord;
            }
            if (chordParts.length > 1 && index === 0) {
              newline += "/";
            }
          });
        }
      });

      newline += "\n";
    });

    return newline;
  },
  loadAllSongs() {
    Vue.prototype.$bus.$emit("loading-true");
    console.log("Loading Songs from server");
    return new Promise((res, rej) => {
      Vue.prototype.$firestore.enableNetwork().then(() => {
        console.log("Network is Enabled");
        this.allSongs().then(songs => {
          Vue.prototype.$firestore.disableNetwork();
          console.log("Network is Disabled");

          Vue.prototype.$bus.$emit("loading-false");
          res(songs);
        });
      });
    });
  },
  allSongs() {
    return new Promise((res, rej) => {
      console.log("Loading Songs");
      let organizationID =
        Vue.prototype.$store.getters["defaultModule/getOrganizationID"];
      Vue.prototype.$firestore
        .collection("songs")
        .where("organizationID", "==", organizationID)
        .where("deleted", "==", false)
        .orderBy("title")
        .get()
        .then(snapshot => {
          let songs = [];
          snapshot.docs.forEach(song => {
            let songdata = song.data();
            songdata.searchref = songdata.title;
            songdata.songid = song.id;
            songdata.columns.forEach(column => {
              column.sections.forEach(section => {
                songdata.searchref += section.text;
              });
            });
            songs.push(songdata);
          });
          Vue.prototype.$store.dispatch(
            "defaultModule/setSongs",
            JSON.stringify(songs)
          );
          res(songs);
        });
    });
  },
  playSong(songID) {
    let songs = Vue.prototype.$store.getters["defaultModule/getSongs"];
    songs.forEach(song => {
      if (song.songid == songID) {
        Vue.prototype.$renderer.send('song', song)
      }
    });
  },
 
  getAnnounces() {
    return new Promise((res, rej) => {
      let organizationID =
        Vue.prototype.$store.getters["defaultModule/getOrganizationID"];
      let announces = [];
      Vue.prototype.$firestore
        .collection("announces")
        .where("organizationID", "==", organizationID)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(announce => {
            let announcedata = announce.data();
            announcedata.announceid = announce.id;
            announces.push(announcedata);
          });

          res(announces);
        });
    });
  },
  filterSongs(str) {
    return new Promise((res, rej) => {
      let songs = Vue.prototype.$store.getters["defaultModule/getSongs"];
      if (str.length >= 3) {
      

        let obj = songs.filter(o =>
          o.searchref.toLowerCase().includes(str.toLowerCase())
        );
        let sng = [];
        obj.forEach(song => {
          sng.push(song);
        });
        const uniquesongs = Array.from(new Set(sng.map(a => a.id))).map(id => {
          return sng.find(a => a.id === id);
        });

        res(sng);
      } 
    });
  },
  syncronization() {
    return new Promise((resolve, reject) => {
      axios
        .post(Vue.prototype.$host + "/api/songs/sync", {
          organizationID: Vue.prototype.$loginInfo.organizationID,
          userEmail: Vue.prototype.$loginInfo.email
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  logout() {
    Vue.prototype.$store.commit("defaultModule/destroySession");
    Vue.prototype.$firebase;
  },
  deleteSong(songID) {
    return new Promise((res, rej) => {
      Vue.prototype.$firestore
        .collection("songs")
        .doc(songID)
        .update({ deleted: true });
      let songs = Vue.prototype.$store.getters["defaultModule/getSongs"];
      let reduced = [];
      songs.forEach(song => {
        if (song.songid !== songID) {
          reduced.push(song);
        }
      });

      Vue.prototype.$store.dispatch(
        "defaultModule/setSongs",
        JSON.stringify(reduced)
      );
      res(reduced);
    });
  },
  checkLicense(licenseKey) {
    return new Promise((res, rej) => {
      const _secretKey = "W0rsh1pstudi0";

      const simpleCrypto = new SimpleCrypto(_secretKey);

      const decryptedKey = simpleCrypto.decrypt(licenseKey);
      // console.log(decryptedKey);
      let decrypted = decryptedKey.split("|");

      if (decryptedKey.substring(0, 5) !== "valid") {
        res(["Invalid"]);
      } else {
        res(decrypted);
      }
    });
  },

  updateLicenseInfo(licenseInfo) {
    return new Promise((res, rej) => {
      localStorage.setItem("licenseName", licenseInfo[1]);
      localStorage.setItem("licenseEmail", licenseInfo[2]);
      localStorage.setItem("licenseType", licenseInfo[3]);
      localStorage.setItem("startModule", licenseInfo[4]);
      localStorage.setItem("validUntil", licenseInfo[5]);
      res("ok");
    });
  },

  checkLicenseExpiration() {
    return new Promise((res, rej) => {
      let validUntil =
        Vue.prototype.$store.getters["defaultModule/getValidUntil"];
      let expireTimestamp = new Date(validUntil).getTime();
      let now = new Date().getTime();
      var Difference_In_Time = expireTimestamp - now;
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      res(Difference_In_Days);
    });
  },

  checkInternetConnection() {
    let serverAddress =
      Vue.prototype.$store.getters["defaultModule/serverAddress"];
    return new Promise((res, rej) => {
      axios
        .get("http://localhost:7777/api/checkConnection")
        .then(({ data }) => {
          res(data.internet);
        })
        .catch(error => {
          res("offline");
        });
    });
  },
  getUserIP(onNewIP) {
    //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
      }),
      noop = function() {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
      sdp.sdp.split("\n").forEach(function(line) {
        if (line.indexOf("candidate") < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function(ice) {
      if (
        !ice ||
        !ice.candidate ||
        !ice.candidate.candidate ||
        !ice.candidate.candidate.match(ipRegex)
      )
        return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  },
  updatePlaylist(playlist) {
    Vue.prototype.$renderer.send("update-playlist", playlist);
  },
  addToPlaylist(songid) {
      Vue.prototype.$renderer.send('add-to-playlist', songid)
  },
  removeFromPlaylist(index) {
  
    Vue.prototype.$renderer.send('remove-from-playlist', index)
  },
  savePlaylist(playlist, title) {
    let playlistData = {
      items: playlist.items,
      title: title,
      id: playlist.id,
      createdBy: Vue.prototype.$store.getters["defaultModule/getDisplayName"],
      createdByEmail: Vue.prototype.$store.getters["defaultModule/getEmail"],
      organizationID:
        Vue.prototype.$store.getters["defaultModule/getOrganizationID"]
    };

    return new Promise((res, rej) => {
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
      if (playlist.id === null || playlist.id === undefined) {
        //console.log("PRIMA")
        delete playlistData.id;
        Vue.prototype.$firestore
          .collection("playlists")
          .add(playlistData)
          .then(doc => {
            playlistData.id = doc.id;
            Vue.prototype.$socket.emit("update-playlist", playlistData);
            res(doc.id);
          });
      } else {
        //console.log("DOPO")
        Vue.prototype.$firestore
          .collection("playlists")
          .doc(playlist.id)
          .set(playlistData);
        Vue.prototype.$socket.emit("update-playlist", playlistData);
        res(playlist.id);
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
  },
  removeCloudPlaylist(id) {
    return new Promise((res, rej) => {
      Vue.prototype.$firestore
        .collection("playlists")
        .doc(id)
        .delete();
      Notify.create({
        message: "Playlist removed",
        color: "positive",
        icon: "fas fa-info",
        textColor: "white",
        position: "bottom"
      });
      res("ok");
    });
  },
  cloudPlaylists() {
    return new Promise((res, rej) => {
      var playlists = [];
      let organizationID =
        Vue.prototype.$store.getters["defaultModule/getOrganizationID"];
      Vue.prototype.$firestore
        .collection("playlists")
        .where("organizationID", "==", organizationID)
        .get()
        .then(documents => {
          documents.docs.forEach(doc => {
            let playlist = doc.data();
            playlist.id = doc.id;
            playlists.push(playlist);
          });
          res(playlists);
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
          handler: () =>  Vue.prototype.$renderer.send("update-playlist", playlist)
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
    this.loadAllSongs().then(() => {
      Vue.prototype.$renderer.send("app-quit");
    });
  },
  appMinimize() {
    Vue.prototype.$renderer.send("app-minimize");
  },
  clearStorage(){
    return new Promise((res, rej)=>{
      localStorage.removeItem("licenseName");
      localStorage.removeItem("licenseEmail");
      localStorage.removeItem("licenseType");
      localStorage.removeItem("computerName");
      localStorage.removeItem("startModule");
      localStorage.removeItem("validUntil");
      localStorage.removeItem("moduleChords");
      localStorage.removeItem("firstConfig");
      localStorage.removeItem("displayName");
      localStorage.removeItem("email");
      localStorage.removeItem("internet");
      localStorage.removeItem("licenseExpired");
      localStorage.removeItem("licenseKey");
      localStorage.removeItem("networkEnabled");
      localStorage.removeItem("organizationID");
      localStorage.removeItem("organizationName");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("songs");
      res('ok')
     })
  }
};
