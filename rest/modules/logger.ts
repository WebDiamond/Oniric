import * as util from "util";
import * as sqlite3 from 'sqlite3';
export class Logger {
      public db: any = new sqlite3.Database('./history.db');
      constructor(){}
      public alertMessage(req: any): void {
        console.log('[!] Richiesta non valida o tentativo di manomissione');
        console.log('[!] Request Malevola o insolita: '+req);
      }
      public initDb(){
        let sql = `CREATE TABLE IF NOT EXISTS info (id INTEGER PRIMARY KEY,address TEXT NOT NULL,chunks TEXT NOT NULL,cookie TEXT NOT NULL);`;
        let sqlx = `CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY,address TEXT NOT NULL,dtime TEXT NOT NULL);`;
        this.db.run(sql);
        this.db.run(sqlx);
        this.db.run(`INSERT INTO info(address,chunks,cookie) VALUES(?,?,?)`,['test','test','test']);
        this.db.run(`INSERT INTO session(address,dtime) VALUES(?,?)`,['test','test']);
      }
      public writeLogs(data: any): void{
        this.db.run(`INSERT INTO info(address,chunks,cookie) VALUES(?,?,?)`,[JSON.stringify(data.domain),JSON.stringify(data),JSON.stringify(data.cookie)]);
        this.db.run(`INSERT INTO session(address,dtime) VALUES(?,?)`,[JSON.stringify(data.domain),'asd']);
        console.log('[?] '+'Salvato nel database:'+JSON.stringify(data.domain)+'\n\n'+JSON.stringify(data)+'\n');
      }
}
