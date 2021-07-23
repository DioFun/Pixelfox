# Pixelbot dépôt

Ceci est le dépôt du PixelBot actuellement nommé "Red Panda".

## Développement 

Fonctionnalité.s en cours de développement:
* Rework des permissions afin de passer en interserveur complet

Développeurs:
|Pseudo|Discord Tag|Email|
|----|-----|-------| 
|DioFun|dιoғυɴ#6669|diofun619@gmail.com|


## Template
### settings/config.js
```javascript
module.exports = {
    TOKEN : "<bot_token>",
    LAVALINK_HOST: "localhost",
    LAVALINK_PORT: 8000,
    LAVALINK_PASSWORD: "pixelbot856978",
    DBCONNECTION: "mongodb://localhost:27017/PixelBot" // Mongodb path
}
```
### settings/permissions.json
```javascript 
{
    "admin": ["771400041981149184", "771399471170977884", "732556955826126898"],
    "modérateur": ["771400041981149184", "771399471170977884", "797218602892918786", "732557014277947413", "854110202697220116", "732556955826126898"],
    "développeur": ["771399471170977884", "741725070422048820"],
    "staff": ["771399515479080960", "831585704693334107"],
    "member": ["771397539948789780", "741784161227898951"]
}
```
### settings/settings.json
```javascript 
{"status":"Skyrise est là"}
```