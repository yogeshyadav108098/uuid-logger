# uuid-logger
Request based logger

## Install

```
npm install --save uuid-logger
```

## Usage


```js

// In App.js/Index.js
const Express = require('express');
var Logger = new (require('uuid-logger'))();

// Add a middleware in start of every request
let App = Express();
App.use(Logger.addRequestId());

Logger.addTransport({
    console: {
        name: 'Console Logger',
        level: 'info',
        colorize: true
    }
});

Logger.addTransport({
    file: {
        fileName: 'tempX.log',
        filePath: '/tmp',
        level: 'info',
        colorize: false,
        json: false,
        zippedArchive: true,
        maxDays: 15
    }
});

Logger.addTransport({
    file: {
        fileName: 'tempX2.log',
        filePath: '/tmp',
        level: 'info',
        colorize: true,
        json: true,
        zippedArchive: true,
        maxDays: 15
    }
});

Logger.addTransport({
    slack: {
        webHookUrl: "https://hooks.slack.com/services/XXXXXX/XXXXXX/XXXXXX",
        channel: "#channelname",
        username: "Bot",
        level: 'info'
    }
});

```