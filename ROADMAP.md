- total abstraction classes refactoring
- implement coverage
- event hooker
- iframe bypass


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




-============================ Metodi di logging dei dati:

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

======================richiedono nuove implementazioni
- /licenseKey/history/list
- /licenseKey/history/clear
==========================================================
