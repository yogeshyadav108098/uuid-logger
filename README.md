# UUId Logger (Request based log tracking)

> Node library to track requests landing on a server for better log tracking. No need to do anything, library takes care of everyting.

<table>
    <thead>
        <tr>
            <th>Linux</th>
            <th>OS X</th>
            <th>Windows</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" align="center">Passed</td>
            <td align="center">Passed</td>
        </tr>
    </tbody>
</table>


## Make your requests more tracable

### Track requests based on unique identifier: ###
![RequestTracking](assets/requestTrack.png?raw=true "Track Requests")

## Have a problem? Come chat with us! ##

[LinkedIn](https://www.linkedin.com/in/yogeshyadav108098)<br />
[Twitter](https://twitter.com/Yogeshyadav098)<br />
[Github](https://github.com/yogeshyadav108098)<br />
[Gmail](<mailto:yogeshyadav108098@gmail.com>)

## Maintained by ##
[Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098)

## Getting started. ##

Uuid Logger will work on most systems.

```bash
npm install --save uuid-logger
```

## Usage

App.js : Add unique Identifier to each request

```javascript

const Express = require('express');
var Logger = new (require('uuid-logger'))();

let App = Express();
App.use(Logger.addRequestId());

```

Logger.js : Require Uuid Logger, add customized formatter

```javascript
// In logger.js
const _ = require('lodash');
const Moment = require('moment');
const Logger = new (require('uuid-logger'))();

const formatter = (logEntry) => {
    let timeStamp = Moment().format('YYYY-MM-DD HH:mm:ss.MS');
    return timeStamp + ' - ' + logEntry.level + ': ' + _.get(logEntry, 'meta.message');
};

Logger.addTransport({
    console: {
        name: 'Console Logger',
        level: 'info',
        colorize: true,
        formatter: formatter
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
        maxDays: 15,
        formatter: formatter
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
        maxDays: 15,
        formatter: formatter
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

module.exports = Logger.getLogger()
```