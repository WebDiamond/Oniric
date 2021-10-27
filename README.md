# Oniric !(https://github.com/WebDiamond/Oniric/blob/main/logo.png)

Oniric is a Restapi for Post-Exploitation in Web application
via XSS Stored and RFI

## Installation

```bash
  npm i
```
## General InfoS

* Use config.json file to adapt Oniric to your requests
* All logs are stored inside history.db
* The server are listening on: Yourip:port/licenseKey
* Restart server when change config.json
* When you compile Oniric put the executable in the same directory of
  config.json and history.db

* When you use rest api functions to add/remove parameters use only string or quotes

## Testing

Everytime the server start , you can obtain the code to place
on the target on this link yourip:port/instanceUser

create an index.html and place it on a wamp/lamp server

```bash
<!doctype html>
<head>
<script>
      javascript obfuscated code inside instanceUser page
</script>
</head>
<body>

<form>
  <label for="fname">First name:</label><br>
  <input type="text" id="fname" name="fname"><br>
  <input type="text" class="aaa"><br>
  <p> asd </p>
  <label for="lname">Last name:</label><br>
  <input type="text" id="lname" name="lname">
  <label for="lname">CC</label><br>
</form>
</body>
</html>
```

## Disclaimer

I'm not responsable for any use of this application.

## Usage for Development
```bash
  npm run dev
```
## Usage for Production
```bash
  npm run compile
  ./Oniric
```


## Screenshot

![Image of Oniric logo](https://github.com/WebDiamond/Oniric/blob/main/proof.png)
![Image of Oniric logo](https://github.com/WebDiamond/Oniric/blob/main/proof2.png)

## Contributing

Pull requests are welcome , For major changes , please open an issue
first to discuss what you would like to change.


## License
