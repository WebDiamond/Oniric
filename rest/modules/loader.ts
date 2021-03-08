export class Loader {
  constructor(){}
  public bannerMessage(): void {
    console.log('[!] ===================================');
    console.log('[!]'+' Oniric');
    console.log('[!]'+' By Webdiamond7 (C) 2020');
    console.log('[!]'+' Github.com/webdiamond');
    console.log('[!] ===================================');
  }
  public randomString(): String{
    return Math.random().toString(36).substr(2, 5);
  }
  public findIp(): any {
    var ipAddresses = [];
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                  ipAddresses.push(alias.address);
                }
              }
            }
      return ipAddresses;
    }
}
