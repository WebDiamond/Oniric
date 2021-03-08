import * as util from "util";
import * as fs from "fs";
export class Logger {
      public fileflag:any;
      constructor(){}
      public getFileRealPath(s:any): any{
      try {
        return fs.realpathSync(s);
      } catch(e){
          return false;
        }
      }
      public logMessage(data:any): void{
         console.log('[?] '+'Salvato nei logs di:'+JSON.stringify(data.domain)+'\n\n'+util.inspect(data,true,14,true)+'\n');
      }
      public alertMessage(req: any): void {
        console.log('[!] Richiesta non valida o tentativo di manomissione');
        console.log('[!] Request Malevola o insolita: '+req);
      }
      public writeLogs(data: any){
        this.fileflag = this.getFileRealPath('./logs');
        if (this.fileflag === false){
          fs.mkdir('./logs',()=>{ console.log('logs dir created')});
        } else {
          try {
            if (fs.existsSync('./logs/'+data.domain+'.log')) {
               fs.readFile('./logs/'+data.domain+'.log', 'utf8', (err,file) => {
                  if(file.toString().includes(JSON.stringify(data))){
                     var result = file.toString().replace("/"+JSON.stringify(data)+"/g", JSON.stringify(data));
                     fs.writeFile('./logs/'+data.domain+'.log', result, 'utf8', (err)=> {
                          if (err) return console.log(err);
                     });
                   } else {
                     fs.appendFile('./logs'+data.domain+'.log',JSON.stringify(data)+"\n", (err)=> {
                     if (err) throw err;
                        this.logMessage(data);
                     });
                    }
                  if (err) return console.log(err);
                });
            }
            else if(!fs.existsSync('./logs/'+data.domain+'.log')) {
             fs.appendFile('./logs/'+data.domain+'.log',JSON.stringify(data)+"\n", (err)=> {
                if (err) throw err;
                this.logMessage(data);
            });
          }
          } catch(err) {
             console.error(err)
          }
        }
      }
}
