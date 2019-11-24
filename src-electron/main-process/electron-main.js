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
const shell = require('electron').shell;
const PCName = store.get('pc-name') || 'COMPUTER'
const fs = require('fs')
const chokidar = require('chokidar');
const rootPath = require('electron-root-path').rootPath;
var padsDir = rootPath.replace(/\\/g, "/") + '/Library/Pads';

try {
  if (!fs.existsSync(padsDir)) {
    fs.mkdirSync(padsDir, {
      recursive: true
    }, err => {})
  }
} catch (err) {
  console.error(err)
}

function readDir(dir){
  return new Promise(resolve=>{
    fs.readdir(dir, function (err, items) {

      resolve(items)
  
    });
  })
}


chokidar.watch(padsDir).on('all', (event, path) => {
  readDir(padsDir).then(items=>{
    mainWindow.webContents.send('pad-folder', items)
  })
});




import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  globalShortcut
} from "electron";


server.use(bodyParser.json());
server.use(cors());

const api = require("../routes/api");

server.use("/api", api);
server.disable("etag");

server.get('/file/:name', (req, res) => {
  let filename = req.params.name
  res.sendFile(filename)


})
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


ipcMain.on("pc-name", (event, name) => {

  store.set('pc-name', name)

});
ipcMain.on('open-download-link', (evt) => {
  shell.openExternal("https://www.simonpietro.it/worshipstudio/downloads/WorshipStudio.exe");
  app.quit()
})
ipcMain.on('song', (event, song) => {
  // sendMessage('song', song)
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
ipcMain.on("slide", (evt, slide) => {

  if (slideWindow !== undefined) {
    slideWindow.webContents.send("slide-content-play", slide);
    slideWindow.webContents.send("slide-content-play", slide);
  }

});
ipcMain.on("black", (evt, status) => {
  if (slideWindow !== undefined) {
    slideWindow.webContents.send("black", status);
  }
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
ipcMain.on("choose-slide-background", (event, data) => {

  const options = {
    title: 'Choose Background for Slide',
    //defaultPath: '/path/to/something/',
    //buttonLabel: 'Do it',
    /*filters: [
      { name: 'xml', extensions: ['xml'] }
    ],*/
    //properties: ['showHiddenFiles'],
    //message: 'This message will only be shown on macOS'
  };

  if (data.backgroundType === 'image' || data.backgroundType === 'video') {
    dialog.showOpenDialog(null, options, (filePaths) => {

      event.sender.send('slide-background-selected', {
        filePath: filePaths[0],
        songID: data.songID,
        slideIndex: data.slideIndex,
        backgroundType: data.backgroundType
      })
    });
  }
})
ipcMain.on("select-file", (event, data) => {

  const options = {
    title: data.title,
    filters: data.filters
  };
  dialog.showOpenDialog(null, options, (filePaths) => {
    event.sender.send(data.event, {
      filePath: filePaths[0],
      data: data.data
    })
  });

})
ipcMain.on("send-me-files", () => {
  mainWindow.webContents.send('library-folders', {
    pads: padsDir
  })

  readDir(padsDir).then(items=>{
    mainWindow.webContents.send('pad-folder', items)
  })
 
})

var secret = "W0rsh1pstudi0";

var simpleCrypto = new SimpleCrypto(secret);
var string =
  "valid|Chiesa Evangelica della Riconciliazione CZ|scarioti@gmail.com|studio|Chords|2019-12-31";
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
      nodeIntegration: true,
      webSecurity: false
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
  // setTimeout(() => {
  mainWindow.maximize();
  //}, 6000);
  //mainWindow.hide();
  // createSplashScreen();
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
        //devTools: false,
        webSecurity: false
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

app.on("ready", () => {
  createWindow()
  globalShortcut.register('F5', () => {
    mainWindow.webContents.send("F5");
  })

  /*
  globalShortcut.register('left', () => {
    mainWindow.webContents.send("left");
  })
  globalShortcut.register('right', () => {
    mainWindow.webContents.send("right");
  })
  */
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
