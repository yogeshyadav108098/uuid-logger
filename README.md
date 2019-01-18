![Request based log tracker](assets/uuidLogger.png?raw=true "Request based log tracker")

# Request based log tracker

> Node library to track requests landing on a server for better log tracking. No need to do anything, library takes care of everyting.

## Preface
In normal scenario, tracking and processing request is little typical. This library is trying to make that simpler and effective. You can just import and add logs like all other logger. Library will take care of differentiating between different requests.

## Features
1. Adds Unique Identifier to logs.
2. Differentiate and tracks different requests.

## Getting started.
Redis-Q Job manager will work on all systems which can run node. 
Request tracking example after using this logger
![RequestTracking](assets/requestTrack.png?raw=true "Track Requests")

## Install

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

1. Add Console Logger
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
module.exports = Logger.getLogger();
```

2. Add File Logger
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
module.exports = Logger.getLogger();
```

3. Add Slack Logger
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
    slack: {
        webHookUrl: "https://hooks.slack.com/services/XXXXXX/XXXXXX/XXXXXX",
        channel: "#channelname",
        username: "Bot",
        level: 'info'
    }
});
module.exports = Logger.getLogger();
```

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Have a problem? Come chat with us! ##
[LinkedIn](https://www.linkedin.com/in/yogeshyadav108098)<br />
[Twitter](https://twitter.com/Yogeshyadav098)<br />
[Github](https://github.com/yogeshyadav108098)<br />
[Gmail](<mailto:yogeshyadav108098@gmail.com>)

## Maintained by ##
[Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098/)

## Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like
 - **Paytm** You can make one-time donations via Paytm (+91-7411000282). I'll probably buy a coffee.
 - **UPI** You can make one-time donations via UPI (7411000282@paytm).
 - **Bitcoin** You can send me bitcoins at this address (or scanning the code below): `3BKvX4Rck6B69JZMuPFFCPif4dSctSxJQ5`

Thanks!


## Where is this library used?
If you are using this library in one of your projects, add it here.


## License
MIT © [Yogesh Yadav](https://www.linkedin.com/in/yogeshyadav108098/)

[contributing]: /CONTRIBUTING.md