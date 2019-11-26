import Vue from "vue";
import axios from "axios";
import SimpleCrypto from "simple-crypto-js";
import {
  Notify
} from "quasar";

const bus = new Vue();

export const ws_helpers = {
  createAlert(message) {
    Notify.create({
      message: message,
      color: "positive",
      icon: "fas fa-info",
      textColor: "white",
      position: "bottom"
    });
  },
  today() {
    let d = new Date();

    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  },
  transpose: (txtChords, val, notation) => {



    txtChords = txtChords.toLowerCase()
    const chords = {
      anglo: {
        c: [
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b"
        ],
        "c#": [
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c"
        ],
        db: [
          "db",
          "d",
          "eb",
          "e",
          "f",
          "gb",
          "g",
          "ab",
          "a",
          "bb",
          "b",
          "c"
        ],
        d: [
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#"
        ],
        "d#": [
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d"
        ],
        eb: [
          "eb",
          "e",
          "f",
          "gb",
          "g",
          "ab",
          "a",
          "bb",
          "b",
          "c",
          "db",
          "d"
        ],
        e: [
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#"
        ],
        f: [
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e"
        ],
        "f#": [
          "f#",
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f"
        ],
        gb: [
          "gb",
          "g",
          "ab",
          "a",
          "bb",
          "b",
          "c",
          "db",
          "d",
          "eb",
          "e",
          "f"
        ],
        g: [
          "g",
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#"
        ],
        "g#": [
          "g#",
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g"
        ],
        ab: [
          "ab",
          "a",
          "bb",
          "b",
          "c",
          "db",
          "d",
          "eb",
          "e",
          "f",
          "gb",
          "g"
        ],
        a: [
          "a",
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#"
        ],
        "a#": [
          "a#",
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a"
        ],
        bb: [
          "bb",
          "b",
          "c",
          "db",
          "d",
          "eb",
          "e",
          "f",
          "gb",
          "g",
          "ab",
          "a"
        ],
        b: [
          "b",
          "c",
          "c#",
          "d",
          "d#",
          "e",
          "f",
          "f#",
          "g",
          "g#",
          "a",
          "a#"
        ]
      },
      latin: {
        do: [
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si"
        ],
        "do#": [
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do"
        ],
        reb: [
          "reb",
          "re",
          "mib",
          "mi",
          "fa",
          "solb",
          "sol",
          "lab",
          "la",
          "sib",
          "si",
          "do"
        ],
        re: [
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#"
        ],
        "re#": [
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re"
        ],
        mib: [
          "mib",
          "mi",
          "fa",
          "solb",
          "sol",
          "lab",
          "la",
          "sib",
          "si",
          "do",
          "reb",
          "re"
        ],
        mi: [
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#"
        ],
        fa: [
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi"
        ],
        "fa#": [
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa"
        ],
        solb: [
          "solb",
          "sol",
          "lab",
          "la",
          "sib",
          "si",
          "do",
          "reb",
          "re",
          "mib",
          "mi",
          "fa"
        ],
        sol: [
          "sol",
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#"
        ],
        "sol#": [
          "sol#",
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol"
        ],
        lab: [
          "lab",
          "la",
          "sib",
          "si",
          "do",
          "reb",
          "re",
          "mib",
          "mi",
          "fa",
          "solb",
          "sol"
        ],
        la: [
          "la",
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#"
        ],
        "la#": [
          "la#",
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la"
        ],
        sib: [
          "sib",
          "si",
          "do",
          "reb",
          "re",
          "mib",
          "mi",
          "fa",
          "solb",
          "sol",
          "lab",
          "la"
        ],
        si: [
          "si",
          "do",
          "do#",
          "re",
          "re#",
          "mi",
          "fa",
          "fa#",
          "sol",
          "sol#",
          "la",
          "la#"
        ]
      }
    };

    let configChords = chords[Vue.prototype.$config.notation];



    const extensions = ["m", "m7", "7", "dim", "sus4", "sus9", "9", "11", "13"];



    const chordTranslate = {
      anglo: {
        do: 'c',
        'do#': 'c#',
        'reb': 'db',
        re: 'd',
        're#': 'd#',
        mib: 'eb',
        mi: 'e',
        fa: 'f',
        'fa#': 'f#',
        solb: 'gb',
        sol: 'g',
        'sol#': 'g#',
        lab: 'ab',
        la: 'a',
        'la#': 'a#',
        sib: 'bb',
        si: 'b',
      }
    }

    const lines = txtChords.split("\n");
    let newline = "";
    lines.forEach(line => {
      const chords = line.split(" ");

      chords.forEach(fullChord => {
        if (fullChord === "") {
          newline += "\xa0";
        } else {
          const chordParts = fullChord.split("/");

          chordParts.forEach((chordPart, index) => {

            if (notation !== Vue.prototype.$config.notation) {
              let chord = chordPart

            }

            let found = false
            let newChord;
            let extension
            let chordExtension = false


            extensions.forEach(extension => {
              let chord

              if (chordPart.slice(chordPart.length - 1).indexOf(extension) !== -1 && chordExtension === false) {
                chord = chordPart.substring(0, chordPart.length - 1)
                newChord = configChords[chord][val] + extension;
                newChord = newChord.charAt(0).toUpperCase() + newChord.slice(1)

                newline += newChord;
                chordExtension = true;

              }
            });



            if (chordExtension === false) {
              newChord = configChords[chordPart][val];
              newChord = newChord.charAt(0).toUpperCase() + newChord.slice(1)
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
    Vue.prototype.$bus.$emit("loading", true);
    Vue.prototype.$bus.$emit("status", {
      message: "Synchronization...",
      color: "yellow"
    });
    return new Promise((res, rej) => {
      Vue.prototype.$firestore.enableNetwork().then(() => {
        console.log("Network is Enabled");
        this.allSongs().then(songs => {
          Vue.prototype.$firestore.disableNetwork();
          console.log("Network is Disabled");

          Vue.prototype.$bus.$emit("loading", false);

          Vue.prototype.$bus.$emit("status", {
            message: "Synchronization Completed!",
            color: "grey"
          });

          res(songs);
        });
      });
    });
  },
  allSongs() {
    return new Promise((res, rej) => {
      console.log("Loading Songs");
      Vue.prototype.$bus.$emit("status", {
        message: "Loading Songs...",
        color: "yellow",
        textColor: "black"
      });
      let organizationID =
        Vue.prototype.$store.getters["defaultModule/getOrganizationID"];
      Vue.prototype.$firestore
        .collection("songs")
        .where("organizationID", "==", organizationID)
        .where("deleted", "==", false)
        .orderBy("title")
        .get()
        .then(snapshot => {
          let songs = {};
          let songList = [];
          let test = []
          snapshot.docs.forEach(song => {

            let sections = []

            let songdata = song.data();

            songdata.searchref = songdata.title.toLowerCase();
            songdata.songid = song.id;
            songdata.sections.forEach((section, index) => {

              songdata.searchref += " " + section.text.toLowerCase();
            });

            songList.push({
              id: songdata.songid,
              title: songdata.title,
              searchref: songdata.searchref
            })
            songs[songdata.songid] = songdata;
          });

          Vue.prototype.$bus.$emit("status", {
            message: "Loading Complete",
            color: "grey"
          });
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

      if (str.length >= 3) {
        let obj = {}
        this.allSongs().then(songs => {
          Object.keys(songs).forEach(key => {

            if (songs[key].searchref.indexOf(str.toLowerCase()) !== -1) {

              obj[key] = songs[key]
            }
          })

          res(obj)

        })

      } else {
        this.allSongs().then(songs => {
          res(songs)
        })
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
        .then(({
          data
        }) => {
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
        .delete().then(function () {
          Vue.prototype.$bus.$emit("status", {
            message: "Song Deleted!",
            color: "grey"
          });

        }).catch(function (error) {
          Vue.prototype.$bus.$emit("status", {
            message: "Error deleting song!",
            color: "grey"
          });
        });
      res("ok")
    });
  },
  checkLicense(licenseKey, email) {
    return new Promise((res, rej) => {
  
      const simpleCrypto = new SimpleCrypto(email);

      const decryptedKey = simpleCrypto.decrypt(licenseKey);

      let decrypted = decryptedKey.split("|");

      if (decryptedKey.substring(0, 5) !== "valid") {
        rej({valid:false});
      } else {
        res({
          valid: true,
          licenseName: decrypted[1],
          licenseEmail: decrypted[2],
          organizationID: decrypted[3],
          validUntil: decrypted[4],
          licenseType: decrypted[5],
          startModule: decrypted[6],
        });
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

    return new Promise((res, rej) => {
      axios
        .get("http://localhost:7777/api/checkConnection")
        .then(({
          data
        }) => {
          res(data.internet);
        })
        .catch(error => {
          res("offline");
        });
    });
  },
  loadFile() {

    return new Promise((res, rej) => {
      axios
        .get("http://localhost:7777/file/test.mp4")
        .then(({
          data
        }) => {
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
      noop = function () {},
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
    pc.createOffer(function (sdp) {
      sdp.sdp.split("\n").forEach(function (line) {
        if (line.indexOf("candidate") < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function (ice) {
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
      organizationID: Vue.prototype.$store.getters["defaultModule/getOrganizationID"]
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
      actions: [{
          label: "Yes",
          color: "yellow",
          handler: () => Vue.prototype.$renderer.send("update-playlist", playlist)
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
  login(username, password) {


    return new Promise((resolve, reject) => {
      Vue.prototype.$firebase
        .auth()
        .signInWithEmailAndPassword(username, password).then(user => {
          Vue.prototype.$firestore.enableNetwork().then(() => {
            Vue.prototype.$firestore
              .collection("users")
              .where("uid", "==", user.user.uid)
              .get()
              .then(snapshot => {
                snapshot.docs.forEach(usr => {
                  console.log("User:", usr.data())
                  Vue.prototype.$firestore
                    .collection("organizations")
                    .doc(usr.data().organizationID)
                    .get()
                    .then(org => {
                      Vue.prototype.$firestore.disableNetwork()
                      Vue.prototype.$store.dispatch("defaultModule/registerSoftware", {
                        displayName: usr.data().displayName,
                        email: usr.data().email,
                        licenseKey: org.data().licenseKey
                      }).then(data => {
                        resolve({
                          auth: true,
                          data: data
                        })
                      }).catch(err => {
                        resolve({
                          auth: false,
                          error: err
                        })
                      })

                    })
                })

              })
          })

        }).catch(err => {
          console.log(err)
          let message
          switch (err.code) {
            case 'auth/network-request-failed':
              message = "Network Unavailable. Please check internet connection!"
              break;
            case 'auth/wrong-password':
              message = "Wrong Password!"
              break;
            case 'auth/user-not-found':
              message = "User Not Found!"
              break;
            case 'auth/invalid-email':
              message = "The email address is badly formatted!"
              break;
            case 'auth/argument-error':
              message = "An error occurred during authentication. Please check email and password!"
              break;
          }
          resolve({
            auth: false,
            error: message
          })
        })
    })
  },
  appMinimize() {
    Vue.prototype.$renderer.send("app-minimize");
  },
  clearStorage() {
    return new Promise((res, rej) => {
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
  },
  versionControl() {
    axios.get('https://www.simonpietro.it/worshipstudio/downloads/version.php').then(({
      data
    }) => {
      const remote_version = data.version.split(".");
      const local_version = Vue.prototype.$ver.split(".");
      console.log("NEW UPDATE")
      if (parseInt(remote_version[0]) > parseInt(local_version[0]) || parseInt(remote_version[1]) > parseInt(local_version[1]) || parseInt(remote_version[2]) > parseInt(local_version[2])) {
        Vue.prototype.$bus.$emit('new-version', data)
      }
    })
  },
  downloadUpdate() {
    axios({
      url: 'https://www.simonpietro.it/worshipstudio/downloads/WorshipStudio.exe',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'WorshipStudio.exe');
      document.body.appendChild(link);
      link.click();
    });
  },

  getSlideBackround(songId, index) {

    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]['slides'][index] !== undefined &&
      songsLocalSettings[songId]['slides'][index]['background'] !== undefined
    ) {
      let background = songsLocalSettings[songId]['slides'][index]['background']
      if (background.backgroundType === 'image') {
        let path = songsLocalSettings[songId]['slides'][index]['background'].imagePath
        path = path.replace(/\\/g, "/")
        console.log("path", path)
        return {
          'background-image': 'url(file://' + path + ')',
          'background-size': 'cover'

        }
      }
      if (background.backgroundType === 'color') {
        let bgcolor = songsLocalSettings[songId]['slides'][index]['background'].backgroundColor
        return {
          'background-color': bgcolor,
        }
      }
    } else {
      return null
    }
  },
  getSlideBackgroundInfo(songId, index) {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]['slides'][index] !== undefined &&
      songsLocalSettings[songId]['slides'][index]['background'] !== undefined
    ) {


      let background = songsLocalSettings[songId]['slides'][index]['background']
      if (background.backgroundType === 'image' || background.backgroundType === 'video') {
        let path = songsLocalSettings[songId]['slides'][index]['background'].imagePath
        path = path.replace(/\\/g, "/")

        return {
          backgroundType: background.backgroundType,
          filePath: 'file:///' + path
        }
      } else {
        return {
          backgroundType: '',
          filePath: ''
        }
      }
    } else {
      return {
        backgroundType: '',
        filePath: ''
      }
    }
  },

  getSlideTextColor(songId, index) {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};



    if (songsLocalSettings[songId] !== undefined &&
      songsLocalSettings[songId]['slides'][index] !== undefined
    ) {


      let textColor = songsLocalSettings[songId]['slides'][index].textColor
      console.log("TEXTCOLOR")
      return {
        'color': textColor,
      }


    } else {
      return {
        'color': 'white'
      }
    }
  }
};
