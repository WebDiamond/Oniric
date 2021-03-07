export class Locker {
  public httpmsg:any;
  constructor(){}
  public verify(conf: any): void{
    if (conf.initDate === conf.endDate){
      this.bannerMessage();
      process.exit();
    } else {
      this.httpmsg="Licenza Verificata";
    }
  }
  public bannerMessage(): void {
    this.httpmsg="Licenza Scaduta";
  }
  public httpMessage(): any {
    return this.httpmsg;
  }
}
