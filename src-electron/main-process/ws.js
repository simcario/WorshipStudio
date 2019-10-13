var os = require("os");
export const ws ={
    getIp() {
      {
        return new Promise((res, rej) => {
          var networkInterfaces = os.networkInterfaces();
          let ipaddr;
          Object.keys(networkInterfaces).forEach(function(ifname) {
            networkInterfaces[ifname].forEach(iface => {
              if (
                (ifname === "Wi-Fi" || ifname === "Ethernet") &&
                iface.family === "IPv4"
              ) {
                ipaddr = iface.address;
              }
            });
          });
          res(ipaddr);
        });
      }
    }
    }
    