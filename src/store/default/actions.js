import Vue from "vue";



export function registerSoftware(context, licenseData) {

 return new Promise((res,rej)=>{
  Vue.prototype.$ws.checkLicense(licenseData.licenseKey, licenseData.email).then(licenseInfo => {
  
    if (licenseInfo.valid === true) {
      localStorage.setItem("organizationName", licenseInfo.licenseName);
      localStorage.setItem("displayName", licenseData.displayName);
      localStorage.setItem("organizationID", licenseInfo.organizationID);
      localStorage.setItem("email", licenseData.userEmail);
      localStorage.setItem("licenseType", licenseInfo.licenseType);
      localStorage.setItem("validUntil", licenseInfo.validUntil);
      localStorage.setItem("startModule", licenseInfo.startModule);
      context.commit("retrieveUser", {
        displayName: licenseData.displayName,
        organizationName: licenseInfo.licenseName,
        email: licenseData.userEmail,
        organizationID: licenseInfo.organizationID,
        licenseKey: licenseData.licenseKey,
        licenseType: licenseInfo.licenseType,
        licenseEmail: licenseInfo.email,
        validUntil: licenseInfo.validUntil,
        startModule: licenseInfo.startModule
      });
      res({
        displayName: licenseData.displayName,
        organizationName: licenseInfo.licenseName,
        email: licenseData.email,
        organizationID: licenseInfo.organizationID,
        licenseKey: licenseData.licenseKey,
        licenseType: licenseInfo.licenseType,
        licenseEmail: licenseInfo.licenseEmail,
        validUntil: licenseInfo.validUntil,
        startModule: licenseInfo.startModule
      })
    } else {
      rej({
        error:"Invalid license or user not enabled!"
      })
    }
  }).catch(()=>{
    rej({
      error:"Invalid license or user not enabled!"
    })
  })
 })

  //localStorage.setItem("licenseKey", licenseData.licenseKey);
}

export function login(context, credentials) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$firebase
      .auth()
      .signInWithEmailAndPassword(credentials.username, credentials.password)
      .then(user => {
        Vue.prototype.$firestore
          .collection("users")
          .where("uid", "==", user.user.uid)
          .get()
          .then(snapshot => {
            console.log(snapshot)
            snapshot.docs.forEach(doc => {
              console.log(doc)
              Vue.prototype.$firestore
                .collection("organizations")
                .doc(doc.data().organizationID)
                .get()
                .then(org => {
                  localStorage.setItem(
                    "organizationName",
                    org.data().displayName
                  );
                  localStorage.setItem("licenseKey", org.data().licenseKey);
                  localStorage.setItem("displayName", doc.data().displayName);
                  localStorage.setItem(
                    "organizationID",
                    doc.data().organizationID
                  );
                  localStorage.setItem("email", doc.data().email);
                  localStorage.setItem("loggedIn", true);
                  Vue.prototype.$ws
                    .checkLicense(localStorage.getItem("licenseKey"))
                    .then(licenseInfo => {
                      console.log('License Info', licenseInfo)

                      let firstConfig = localStorage.getItem("firstConfig");
                      //console.log(firstConfig, typeof firstConfig);
                      if (
                        licenseInfo[3] === "church" ||
                        licenseInfo[3] === "studio"
                      ) {
                        console.log("network enabled");
                        localStorage.setItem("networkEnabled", true);
                        Vue.prototype.$firestore.enableNetwork();
                      } else {
                        console.log("network disabled");
                        localStorage.setItem("networkEnabled", false);
                        Vue.prototype.$firestore.disableNetwork();
                      }

                      let userdata;
                      if (firstConfig !== "true") {
                        Vue.prototype.$ws
                          .updateLicenseInfo(licenseInfo)
                          .then(() => {
                            userdata = {
                              organizationName: localStorage.getItem(
                                "organizationName"
                              ),
                              licenseKey: localStorage.getItem("licenseKey"),
                              organizationID: localStorage.getItem(
                                "organizationID"
                              ),
                              displayName: localStorage.getItem("displayName"),
                              email: localStorage.getItem("email"),
                              networkEnabled: localStorage.getItem(
                                "networkEnabled"
                              ),
                              licenseName: localStorage.getItem("licenseName"),
                              licenseEmail: localStorage.getItem(
                                "licenseEmail"
                              ),
                              licenseType: localStorage.getItem("licenseType"),
                              startModule: localStorage.getItem("startModule"),
                              validUntil: localStorage.getItem("validUntil")
                            };

                            context.commit("retrieveUser", userdata);
                          });
                      } else {
                        userdata = {
                          organizationName: localStorage.getItem(
                            "organizationName"
                          ),
                          licenseKey: localStorage.getItem("licenseKey"),
                          organizationID: localStorage.getItem(
                            "organizationID"
                          ),
                          displayName: localStorage.getItem("displayName"),
                          email: localStorage.getItem("email"),
                          networkEnabled: localStorage.getItem(
                            "networkEnabled"
                          ),
                          licenseName: localStorage.getItem("licenseName"),
                          licenseEmail: localStorage.getItem("licenseEmail"),
                          licenseType: localStorage.getItem("licenseType"),
                          startModule: localStorage.getItem("startModule"),
                          validUntil: localStorage.getItem("validUntil")
                        };

                        context.commit("retrieveUser", userdata);
                      }
                    });

                  resolve({
                    startModule: localStorage.getItem("startModule"),
                    firstConfig: localStorage.getItem("firstConfig")
                  });
                });
            });
          }).catch(err => {
            reject({
              error: err.message
            });
          });
      })
      .catch(err => {

        reject({
          error: err.message
        });
        localStorage.setItem("displayName", null);
        localStorage.setItem("organizationName", null);
        localStorage.setItem("email", null);
        localStorage.setItem("loggedIn", false);
      });
  });
}

export function savePreferences(context, preferences) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("computerName", preferences.computerName);
    localStorage.setItem("startModule", preferences.startModule);
    localStorage.setItem("moduleChords", preferences.moduleChords);
    context.commit("retrieveSettings", preferences);
    resolve({
      response: "ok"
    });
  });
}

export function saveMobilePreferences(context, preferences) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("serverAddress", preferences.serverAddress);
    context.commit("retrieveMobileSettings", preferences);
    resolve({
      response: "ok"
    });
  });
}

export function firstConfig(context, config) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("licenseName", config.licenseName);
    localStorage.setItem("licenseEmail", config.licenseEmail);
    localStorage.setItem("organizationID", config.organizationID);
    localStorage.setItem("licenseType", config.licenseType);
    localStorage.setItem("computerName", config.computerName);
    localStorage.setItem("startModule", config.startModule);
    localStorage.setItem("validUntil", config.validUntil);
    localStorage.setItem("moduleChords", config.moduleChords);
    localStorage.setItem("firstConfig", true);
    context.commit("retrieveSettings", config);
    resolve("ok");
  });
}

export function internetStatus(context, status) {
  return new Promise((res, rej) => {
    localStorage.setItem("internet", status);
    context.commit("retrieveInternetStatus", status);
    res("OK");
  });
}

export function serverAddress(context, serverAddress) {
  // var serverAddress = 'http://'+ ip + ':7777';
  return new Promise((res, rej) => {
    localStorage.setItem("serverAddress", serverAddress);
    context.commit("retrieveServerAddresss", serverAddress);
    res("OK");
  });
}

export function licenseExpired(context, expired) {
  return new Promise((res, rej) => {
    localStorage.setItem("licenseExpired", expired);
    context.commit("retrieveLicenseExpired", expired);
    res("OK");
  });
}

export function setSongs(context, songs) {
  return new Promise((res, rej) => {
    localStorage.setItem("songs", songs);
    context.commit("retrieveSongs", songs);
    res("OK");
  });
}
export function setSongList(context, songList) {
  return new Promise((res, rej) => {
    localStorage.setItem("songsList", songList);
    context.commit("retrieveSongList", songList);
    res("OK");
  });
}

export function setSongLocalSetting(context, settings) {
  return new Promise((res, rej) => {
    let currentSettings = JSON.parse(localStorage.getItem('songsLocalSettings'));
    if (currentSettings === null) {
      currentSettings = {}
    }
    if (currentSettings[settings.songID] === undefined) {
      currentSettings[settings.songID] = {}
    }
    if (currentSettings[settings.songID]['slides'] === undefined) {
      currentSettings[settings.songID]['slides'] = {}
    }
    if (currentSettings[settings.songID]['slides'][settings.slideIndex] === undefined) {
      currentSettings[settings.songID]['slides'][settings.slideIndex] = {}
    }
    switch (settings.type) {
      case 'slide-background':
        currentSettings[settings.songID]['slides'][settings.slideIndex]['background'] = {
          backgroundType: settings.backgroundType,
          imagePath: settings.filePath,
          backgroundColor: settings.backgroundColor
        }
        break;
      case 'text-color':
        currentSettings[settings.songID]['slides'][settings.slideIndex]['textColor'] = settings.textColor

        break;
    }

    localStorage.setItem("songsLocalSettings", JSON.stringify(currentSettings));
    context.commit("retrieveSongsLocalSettings", currentSettings);

  });
}

export function setSongTemplate(context, songInfo) {
  return new Promise(res => {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songInfo.songID] === undefined) {
      songsLocalSettings[songInfo.songID] = {}
    }
    if (songsLocalSettings[songInfo.songID]['slides'] === undefined) {
      songsLocalSettings[songInfo.songID]['slides'] = {}
    }
    if (songsLocalSettings[songInfo.songID]['slides'][songInfo.slideIndex] === undefined) {
      songsLocalSettings[songInfo.songID]['slides'][songInfo.slideIndex] = {}
    }
    songsLocalSettings[songInfo.songID]['slides'][songInfo.slideIndex]['template'] = songInfo.template
    localStorage.setItem("songsLocalSettings", JSON.stringify(songsLocalSettings));
    context.commit("retrieveSongsLocalSettings", songsLocalSettings);
    res("OK");
  })
}

export function setSongPartPosition(context, songInfo) {
  return new Promise(res => {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songInfo.songID] === undefined) {
      songsLocalSettings[songInfo.songID] = {}
    }
    if (songsLocalSettings[songInfo.songID]['partPosition'] === undefined) {
      songsLocalSettings[songInfo.songID]['partPosition'] = songInfo.partPosition
    } else {
      songsLocalSettings[songInfo.songID]['partPosition'] = songInfo.partPosition
    }


    localStorage.setItem("songsLocalSettings", JSON.stringify(songsLocalSettings));
    context.commit("retrieveSongsLocalSettings", songsLocalSettings);
    res("OK");
  })
}

export function setSongTextStyle(context, songInfo) {
  return new Promise(res => {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songInfo.songID] === undefined) {
      songsLocalSettings[songInfo.songID] = {}
    }
    if (songsLocalSettings[songInfo.songID]['textStyle'] === undefined) {
      songsLocalSettings[songInfo.songID]['textStyle'] = songInfo.textStyle
    } else {
      songsLocalSettings[songInfo.songID]['textStyle'] = songInfo.textStyle
    }
    console.log(songsLocalSettings)
    localStorage.setItem("songsLocalSettings", JSON.stringify(songsLocalSettings));
    context.commit("retrieveSongsLocalSettings", songsLocalSettings);
    res("OK");
  })
}

export function setSongPad(context, songInfo) {
  return new Promise(res => {
    let songsLocalSettings = JSON.parse(localStorage.getItem('songsLocalSettings')) || {};

    if (songsLocalSettings[songInfo.songID] === undefined) {
      songsLocalSettings[songInfo.songID] = {}
    }
    if (songsLocalSettings[songInfo.songID]['pad'] === undefined) {
      songsLocalSettings[songInfo.songID]['pad'] = {
        filename: songInfo.fileName,
        region: songInfo.region,
      }
    } else {
      songsLocalSettings[songInfo.songID]['pad'] = {
        filename: songInfo.fileName,
        region: songInfo.region,
      }
    }

    localStorage.setItem("songsLocalSettings", JSON.stringify(songsLocalSettings));
    context.commit("retrieveSongsLocalSettings", songsLocalSettings);
    res("OK");
  })
}

export function saveSlideTemplate(context, template) {
  return new Promise((res, rej) => {
    let templates = JSON.parse(localStorage.getItem('slideTemplates')) || {};
    templates[template.id] = template;
    localStorage.setItem("slideTemplates", JSON.stringify(templates));
    context.commit("retrieveSlideTemplates", templates)
    res('ok')
  })
}

export function deleteSongTemplate(context, id) {
  return new Promise((res, rej) => {
    let templates = JSON.parse(localStorage.getItem('slideTemplates')) || {};
    delete templates[id]
    localStorage.setItem("slideTemplates", JSON.stringify(templates));
    context.commit("retrieveSlideTemplates", templates)
    res('ok')
  })
}

export function createPadFolder(context, data) {
  let padLibrary = JSON.parse(localStorage.getItem('padLibrary')) || {}
  if (padLibrary['folders'] === undefined) {
    padLibrary['folders'] = {};
  }
  padLibrary['folders'][data.folderID] = {
    name: data.folderName,
    items: []
  }
  localStorage.setItem('padLibrary', JSON.stringify(padLibrary))
  context.commit("retrievePadLibrary", padLibrary)
}

export function updatePadLibrary(context, data) {
  let padLibrary = JSON.parse(localStorage.getItem('padLibrary')) || {}
}
