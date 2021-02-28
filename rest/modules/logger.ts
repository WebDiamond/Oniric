import * as util from "util";
import * as fs from "fs";
import {Loader} from "./loader";
export class Logger {
      public loader:Loader;
      constructor(){
        this.loader = new Loader();
      }
      public logMessage(data:any): void{
         console.log('[?] '+this.loader.colorStr(this.loader.color.Red,'Salvato nei logs di:')+JSON.stringify(data.domain)+'\n\n'+util.inspect(data,true,14,true)+'\n');
      }
      public alertMessage(req: any): void {
        console.log('[!] ',this.loader.colorStr(this.loader.color.Red,'Richiesta non valida o tentativo di manomissione'));
        console.log('[!] ',this.loader.colorStr(this.loader.color.Red,'Request Malevola o insolita:'));
        console.log('[!] ',req);
      }
      public jsonError(): void {
        console.log('[!] ',this.loader.colorStr(this.loader.color.Red,'Configurazione errata immettere un file config.json valido tramite -c config.json'))
      }
      public writeLogs(data: any){
        try {
          if (fs.existsSync('./'+data.domain+'.log')) {
             fs.readFile(data.domain+'.log', 'utf8', (err,file) => {
                if(file.toString().includes(JSON.stringify(data))){
                   var result = file.toString().replace("/"+JSON.stringify(data)+"/g", JSON.stringify(data));
                   fs.writeFile(data.domain+'.log', result, 'utf8', (err)=> {
                        if (err) return console.log(err);
                   });
                 } else {
                   fs.appendFile(data.domain+'.log',JSON.stringify(data)+"\n", (err)=> {
                   if (err) throw err;
                      this.logMessage(data);
                   });
                  }
                if (err) return console.log(err);
              });
          }
        else if(!fs.existsSync('./'+data.domain+'.log')) {
           fs.appendFile(data.domain+'.log',JSON.stringify(data)+"\n", (err)=> {
              if (err) throw err;
              this.logMessage(data);
          });
        }
        } catch(err) {
           console.error(err)
        }
      }
}
