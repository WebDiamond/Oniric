export class Loader {
constructor(){}
  public color: any = {
    Reset: "\x1b[0m",
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m"
  }
  public colorStr(color, string): string {
    return `${color}${string}${this.color.Reset}`;
  }
  public bannerMessage(): void {
    console.log('[!]',this.colorStr(this.color.Green,"==================================="));
    console.log('[!]'+' Oniric');
    console.log('[!]'+' By Webdiamond7 (C) 2020');
    console.log('[!]'+' Github.com/webdiamond');
    console.log('[!]',this.colorStr(this.color.Green,"===========Parameters============="));
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
