- classes refactoring
- implement coverage and unit tests
- use jade
- event hooker
- iframe bypass
- end license system
- end client-side crossbrowser

-================================ Sistema di licenze:

l'esigenza nasce nel momento in cui si necessita della gestione centralizzata
di tutti i clienti aderenti al servizio sotto un unica vps opportunamente
hardenizzata e successivamente gestita, quindi ogni istanza del software oniric
avrà la sua chiave di licenza e la sua data di scadenza, nel momento in cui la chiave
sarà scaduta non sarà piu possibile utilizzare il software

implementazione dell'oggetto locker:

sarà la classe che possiede tutti i metodi per gestire la scadenza della chiave di licenza
verrà instanziata ed avviata nel costruttore della classe principale , verifica il file json
impostato dal gestore della vps , se le due date coincidono l'applicazione verrà eseguita ma
con un messaggio relativo alla scadenza avvenuta , altrimenti procederà con la normale esecuzione




-============================ Metodi di logging dei dati (da testare):

il modo utilizzato per raccogliere dati dall'esterno attualmente nel momento in cui
viene fatto lo stream di un buffer su un file di logs , nel nostro server la sua posizione
non viene gestita correttamente, i files vanno quindi contenuti in un altra cartella,
inoltre il metodo che si occupa della verifica di un dato doppione o incompleto attualmente
non eseguono correttamente il lavoro, quindi va modificata la classe logger nella fattispecie il metodo writeLogs()



=========================== MaaS interface (successivamente da abbellire l'html ahah ):

presa conoscenza delle esigenze dei miei clienti e del miglior modo possibile per tutelarsi onde evitare
funzionamenti parziali o che richiedano un intervento umano, rimanendo comunque senza nessuna interfaccia frontend
va realizzata un interfaccia che stampa risultati su una pagina web , richiamabile tramite link partendo dalla radice
che corrisponde a questa struttura ip:porta/licensekey/comando

- /licenseKey/help  
- /licenseKey/status
- /licenseKey/restart
- /licenseKey/tags/add/nometag
- /licenseKey/ids/add/nomeid
- /licenseKey/classes/add/nomeclasse
- /licenseKey/tags/remove/nometag
- /licenseKey/ids/remove/nomeid
- /licenseKey/classes/remove/nomeclasse
- /licenseKey/polling/modify/numero(1-1000)


======================Problemino (risolto)=======

se aggiorno tramite la rest api gli elementi che andra a sniffare il nostro sniffer il suo endpoint non viene
aggiornato perche vanno ripetute nello stesso ordine le chiamate ai metodi della classe generators all'interno del
costruttore della classe app, per fare una maggiore chiarezza dinanzi ad un refactoring imminente di tutto il codice
credo che comincerò a togliere tutti i console logs non necessari ed individuare il modus operandi per aggiornare core e sniffer ad ogni nuova modifica tramite l'interfaccia cliente fornita dal restapi





================================== Rivoluzione del sistema di logs ==================================

in seguito ad un breve refactoring del codice ed in seguito alla ristrutturazione degli stream di output
che permettono un interfaccia utente compatta utilizzabile tramite http per quanto riguarda la registrazione dei dati
passerò dalla gestione dei logs tramite files ad una gestione mirata su un database sqlite, in modo da poter:

registrare correttamente i dati
oltre ai dati sniffati avere anche uno storico dei dati consultabile tramite interfaccia http
possibilita di creare un registro centralizzato di ogni cliente per avere i logs filtrati di ristrutturazione


procedimento:

la classe logger avrà a disposizione:

un metodo per la verifica della presenza del database
un metodo per accedere ad un database sqlite


exfiltra i dati ulteriormente per un adattamento alla struttura del database,

inoltre ogni dato indipendentemente che questo provenga da un malware clientside o serverside non importa perche i dati avranno sempre la medesima struttura



==============================================================================================================================


Ho realizzato la registrazione dei dati anziche nei logs bensi in un database sqlite , adesso mi manca
un filtro che scarta i dati doppioni , in modo tale da non intasare il database con dati inutili o gia presenti
successivamente aggiornerò il MaaS con le seguenti rotte:

- /licenseKey/history/list
- /licenseKey/logs/list
- /licenseKey/logs/clear
- /licenseKey/history/clear
- /licenseKey/get/address
- /licenseKey/get/keyword

========== sarebbe cosa gradita se la pagina che riporta i risultati relativi ai dati sniffati si aggiornasse in modo asynch
========== verifica data del sistema di licenza e struttura con pm2
========== coverage whitebox sui parametri delle funzioni per regolarsi su tipi piu stringenti
========== ogni rotta deve gestire i dati con una callback
========== salvare il datetime delle sessioni nel db
========== aggiornare il contenuto della tabella /licensekey/help del restapi sul frontends
========== lo sniffer core deve avere endpoint fisso e non randomico, nemmeno per scelta
