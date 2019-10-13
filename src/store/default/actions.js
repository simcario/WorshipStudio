import Vue from "vue";
import { firestoreAction } from 'vuexfire'
import axios from "axios";
import db from "../../helpers/firebase"

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
          });
      })
      .catch(err => {
        console.log(err)
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
    resolve({ response: "ok" });
  });
}

export function saveMobilePreferences(context, preferences) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("serverAddress", preferences.serverAddress);
    context.commit("retrieveMobileSettings", preferences);
    resolve({ response: "ok" });
  });
}

export function firstConfig(context, config) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("licenseName", config.licenseName);
    localStorage.setItem("licenseEmail", config.licenseEmail);
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


