# DHBW Vorlesung Webprogrammierung 2019

Live Demo: https://kaltenstadler.net  
Github: https://github.com/M4RC0K4LT/Webprogrammierung


## "Getting Started"

Installiere Abhängigkeiten und starte Entwicklungsserver:

### Voraussetzungen

Installiere benötigte NPM-Module:

```
cd server && npm install
cd client && npm install
```

Optional GoogleMapsAPI-Token setzen (sollte gesetzt sein): 

```
server/database/customers.js -> apiKey: "YourPersonalAPIKey"
```

### Starten

Der Start des ReactClients zieht sich beim ersten Mal etwas in die Länge, da importierte Module geladen werden müssen.

```
cd client && npm start
cd server && npm start
```

Express-Backend: Port 3001  
React-FrontEnd: Port 80

## Die Website öffnen

Öffne folgenden Link im Browser um die Website zu öffnen: http://localhost/    
Eine bereits bereitgestellte Umgebung ist unter diesem Link zu finden: https://kaltenstadler.net