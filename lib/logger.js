'use strict';

const Stringify = require('json-stringify-safe');
const GetNamespace = require('continuation-local-storage').getNamespace;

const RequestConfig = require('../config/request');
const ThreadStorage = new (require('./threadStorage'))();


class Logger {
    constructor(options) {
        if (!options || !options.winston) {
            throw new Error('Logger can not be initiated');
        }
        this.winston = options.winston;
    }

    formatMessage(args, type) {
        try {
            let session = new GetNamespace(RequestConfig.SESSION_NAME);
            let requestId = ThreadStorage.getRequestId(session) || 'Service Logs';

            let message = requestId + ':';
            let counter = 0;
            let loggerContexts = {};

            try {
                loggerContexts = JSON.parse(args[0]);
            } catch (error) { }

            if (loggerContexts.context) {
                counter = 1;
            } else {
                loggerContexts = {context: {}};
            }

            for (let i = counter; i < args.length; i++) {
                if (args[i] === undefined) {
                    continue;
                }

                if (type !== 'error') {
                    try {
                        message += (' ' + JSON.parse(Stringify(args[i])));
                    } catch (error) {
                        message += (' ' + Stringify(args[i]));
                    }
                    continue;
                }

                if (typeof args[i] !== 'object') {
                    try {
                        message += (' ' + JSON.parse(Stringify(args[i])));
                    } catch (error) {
                        message += (' ' + Stringify(args[i]));
                    }
                    continue;
                }

                message += (' #### Message: ' + args[i].message);
                Object.keys(args[i]).forEach(function(key) {
                    try {
                        message += (' #### ' + key + ': ' + JSON.parse(Stringify(args[i][key])));
                    } catch (error) {
                        message += (' #### ' + key + ': ' + Stringify(args[i][key]));
                    }
                });
                message += (' #### Stack: ' + args[i].stack);
            }

            loggerContexts.context.requestId = requestId;
            loggerContexts.context.logType = loggerContexts.context.logType || 'App';

            return {
                context: loggerContexts.context,
                message
            };
        } catch (error) {
            console.log(error);
            return error.toString();
        }
    }

    log(...args) {
        this.winston.info(this.formatMessage(args));
    }

    error(...args) {
        this.winston.error(this.formatMessage(args, 'error'));
    }

    critical(...args) {
        this.winston.error(this.formatMessage(args));
    }

    warn(...args) {
        this.winston.warn(this.formatMessage(args));
    }

    verbose(...args) {
        this.winston.verbose(this.formatMessage(args));
    }

    info(...args) {
        this.winston.info(this.formatMessage(args));
    }

    debug(...args) {
        this.winston.debug(this.formatMessage(args));
    }

    silly(...args) {
        this.winston.silly(this.formatMessage(args));
    }

    stream() {
        let self = this;
        return {
            write: function(message) {
                self.info(message);
            }
        };
    }
}

module.exports = Logger;

