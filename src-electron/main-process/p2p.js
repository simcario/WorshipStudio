const swarm = require("discovery-swarm");
const crypto = require("crypto");



let clients = {};
var connSeq = 0;

const myId = crypto.randomBytes(32);

const config = {
  id: myId
};

const sw = swarm(config);

(() => {
  sw.listen(7778);
  console.log("P2P Listening");
  sw.join("worshipstudio");

  sw.on("connection", (conn, info) => {
    // Connection id
    const seq = connSeq;

    const peerId = info.id.toString("hex");
    console.log(`Connecteddddd #${seq} to peer: ${peerId}`);

    // Keep alive TCP connection with peer
    if (info.initiator) {
      try {
        conn.setKeepAlive(true, 600);
      } catch (exception) {
        console.log("exception", "KeepAlive Error");
      }
    }

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
        case "computer-name":
          console.log('computer name', peerId)
          break;
      }
    });

    conn.on("close", () => {
      // Here we handle peer disconnection
      console.log(`Connection ${seq} closed, peer id: ${peerId}`);
      delete clients[peerId]
    });
    if (!clients[peerId]) {
      clients[peerId] = {};
    }
    clients[peerId].conn = conn;
    clients[peerId].swq = connSeq;

    connSeq++;
  });
})()


