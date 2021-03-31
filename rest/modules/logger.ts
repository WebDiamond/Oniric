import * as util from "util";
import * as sqlite3 from 'sqlite3';
export class Logger {
      public db: any = new sqlite3.Database('./history.db');
      constructor(){}
      public alertMessage(req: any): void {
        console.log('[!] Richiesta non valida o tentativo di manomissione');
        console.log('[!] Request Malevola o insolita: '+req);
      }
      public initDb(): void{
        let sql = `CREATE TABLE IF NOT EXISTS info (id INTEGER PRIMARY KEY,
                                                    address TEXT NOT NULL,
                                                    chunks TEXT NOT NULL,
                                                    cookie TEXT NOT NULL,
                                                    UNIQUE(chunks));`;
        this.db.run(sql);
        this.db.run(`INSERT OR IGNORE INTO info(address,chunks,cookie) VALUES(?,?,?)`,['test','test','test']);
      }
      public writeLogs(data: any): void{
        this.db.run(`INSERT OR IGNORE INTO info(address,chunks,cookie) VALUES(?,?,?)`,[JSON.stringify(data.domain).replace(/"/g,''),JSON.stringify(data),JSON.stringify(data.cookie)]);
      }
}
