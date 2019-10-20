const express = require("express");
const Store = require("electron-store");
const store = new Store();
const bodyParser = require("body-parser");
const cors = require("cors");
const url = require("url");
//const ip = require("ip");
const swarm = require("discovery-swarm");
const crypto = require("crypto");
var songsController = require("../controllers/songs");

const SimpleCrypto = require("simple-crypto-js").default;
const server = express();
var http = require("http").createServer(server);
http.listen(7777)

const electron = require("electron");

const PCName = store.get('pc-name') || 'COMPUTER'
//import { ws } from "./ws";

import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
 globalShortcut
} from "electron";


server.use(bodyParser.json());
server.use(cors());

const api = require("../routes/api");

server.use("/api", api);
server.disable("etag");
/*
ws.scanNetwork().then(ips => {
  console.log(ips);
});
*/

// Common Funcions

//End Common Funcions

let playlist = {
  id: null,
  title: null,
  createdBy: null,
  vreatedByEmail: null,
  items: []
};




function sendMessage(type, message) {

  for (let id in clients) {
    clients[id].conn.write(
      Buffer.from(
        JSON.stringify({
          type: type,
          message: message
        })
      )
    );
  }
}


let clients = {};
var connSeq = 0;


const myId = crypto.randomBytes(32);
const config = {
  id: myId + '{wsarray}' + PCName
};
const sw = swarm(config);
(() => {
  sw.listen(7778);
  console.log("P2P Listening");
  
  sw.join("worshipstudio");


  sw.on("connection", (conn, info) => {
    
    console.log(info.port)

      // Connection id
    const seq = connSeq;
    
    const peerId = info.id.toString();
    const peeArray = peerId.split(/{wsarray}/)
    const peerName = peeArray[1]

    console.log(`Connected #${seq} to peer: ${peerName}`);


  

    conn.on("data", data => {
      // Here we handle incomming messages
      let message = JSON.parse(data.toString());
      let content = message.message;
      switch (message.type) {
        case "song":
          mainWindow.webContents.send('song', content)
          break;
        case "playlist-data":
          mainWindow.webContents.send('playlist-data', content)
          break;

      }
    });

    conn.on("close", () => {
      // Here we handle peer disconnection
      console.log(`Connection ${seq} closed, peer id: ${peerName}`);
      delete clients[peerId]
      mainWindow.webContents.send('peers', clients)
      console.log('Peers length', Object.keys(clients).length)
    });
    if (!clients[peerId]) {
      clients[peerId] = {};
    }
    clients[peerId].conn = conn;
    clients[peerId].swq = connSeq;
    clients[peerId].name = peerName;
    console.log('Peers length', Object.keys(clients).length)
    mainWindow.webContents.send('peers', clients)
    mainWindow.webContents.send('newPeer', peerName)
    connSeq++;
   
  });
})()


ipcMain.on("pc-name", (event, name) => {

 
  store.set('pc-name', name)

});



ipcMain.on('song', (event, song) => {
  sendMessage('song', song)
  mainWindow.webContents.send('song', song)
})

ipcMain.on('get-playlist', (event) => {
  sendMessage('playlist-data', playlist)
  mainWindow.webContents.send('playlist-data', playlist)
})
ipcMain.on('add-to-playlist', (event, song) => {
  playlist.items.push(song);
  sendMessage('playlist-data', playlist)
  mainWindow.webContents.send('playlist-data', playlist)
})
ipcMain.on('remove-from-playlist', (event, index) => {
  playlist.items.splice(index, 1);
  sendMessage('playlist-data', playlist)
  mainWindow.webContents.send('playlist-data', playlist)
})
ipcMain.on("update-playlist", (evt, content) => {
  playlist = content;
  sendMessage('playlist-data', playlist)
  mainWindow.webContents.send('playlist-data', playlist)
});


ipcMain.on("slide", (evt, text) => {

  slideWindow.webContents.send("slide-content-play", text);
});

ipcMain.on("black", (evt, status) => {
  slideWindow.webContents.send("black", status);
});




ipcMain.on("open-slide-window", (event, data) => {
  if (slideWindowOpen !== true) {
    console.log("open-slide-window");

    createSlideWindow();
  }
});
ipcMain.on("show-slide-window", (event, data) => {
  var slideWindow;
  createSlideWindow();
});
ipcMain.on("hide-slide-window", (event, data) => {
  if (slideWindowOpen === true) {
    slideWindow.hide();
  }
});
ipcMain.on("app-quit", (event, data) => {
  app.quit();
});
ipcMain.on("app-minimize", (event, data) => {
  mainWindow.minimize();
});
ipcMain.on("restart-app", (event, data) => {
  console.log("RESTART");
  app.relaunch();
  app.quit();
});

var secret = "W0rsh1pstudi0";

var simpleCrypto = new SimpleCrypto(secret);
var string =
  "valid|Chiesa Evangelica della Riconciliazione CZ|scarioti@gmail.com|studio|ChordsHome|2019-12-31";
var chiperText = simpleCrypto.encrypt(string);
var decrypted = simpleCrypto.decrypt(chiperText);
console.log(chiperText);

if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}





var mainWindow, splashScreen, slideWindow;
var slideWindowOpen;



function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    frame: false,
    icon: require("path").join(__statics, "icons/64x64.png"),
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.on("close", event => {
    app.quit();
  });
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
  mainWindow.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  mainWindow.once("ready-to-show", () => {
    mainWindow.hide();
  });

  mainWindow.loadURL(process.env.APP_URL);
  setTimeout(() => {
    mainWindow.maximize();
  }, 6000);
  mainWindow.hide();
  createSplashScreen();
}

function createSplashScreen() {
  splashScreen = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    frame: false,
    titleBarStyle: "hidden",
    modal: true,
    show: false,
    icon: require("path").join(__statics, "icons/64x64.png"),
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  });
  splashScreen.once("ready-to-show", () => {
    splashScreen.show();
  });

  splashScreen.loadURL(
    url.format({
      pathname: require("path").join(__statics, "pages/splashScreen.html"),
      protocol: "file",
      slashes: true
    })
  );

  setTimeout(() => {
    splashScreen.hide(), mainWindow.maximize();
  }, 5000);
}

function createSlideWindow() {
  console.log("opening");
  slideWindowOpen = true;
  var electronScreen = electron.screen;
  var displays = electronScreen.getAllDisplays();
  var externalDisplay = null;
  for (var i in displays) {
    if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
      externalDisplay = displays[i];
      break;
    }
  }

  if (externalDisplay) {
    slideWindow = new BrowserWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
      fullscreen: true,
      titleBarStyle: "hidden",
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    });
    slideWindow.on("close", () => {
      slideWindowOpen = false;
    });
    slideWindow.loadURL(process.env.APP_URL + "#/slide");
    slideWindow.once("ready-to-show", () => {
      slideWindow.maximize();
    });
  }
}

app.on("ready", ()=>{
  createWindow()
  globalShortcut.register('F5', () => {
    mainWindow.webContents.send("F5");
  })
  globalShortcut.register('pagedown', () => {
    mainWindow.webContents.send("pagedown");
  })
  globalShortcut.register('pageup', () => {
    mainWindow.webContents.send("pageup");
  })
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
Menu.setApplicationMenu(null);
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});



