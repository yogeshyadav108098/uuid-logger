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
        let session = new GetNamespace(RequestConfig.SESSION_NAME);
        let requestId = ThreadStorage.getRequestId(session);

        let message = '';
        for (let i = 0; i < args.length; i++) {
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

            Object.keys(args[i]).forEach(function(key) {
                try {
                    message += (' #### ' + key + ': ' + JSON.parse(Stringify(args[i][key])));
                } catch (error) {
                    message += (' #### ' + key + ': ' + Stringify(args[i][key]));
                }
            });
        }

        message = requestId ? requestId.toString() + ':' + message : 'Service Logs: ' + message;
        return message;
    }

    log(...args) {
        try {
            this.winston.info(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    error(...args) {
        try {
            this.winston.error(this.formatMessage(args, 'error'));
        } catch (error) {
            console.log(error);
        }
    }

    critical(...args) {
        try {
            this.winston.error(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    warn(...args) {
        try {
            this.winston.warn(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    verbose(...args) {
        try {
            this.winston.verbose(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    info(...args) {
        try {
            this.winston.info(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    debug(...args) {
        try {
            this.winston.debug(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
    }

    silly(...args) {
        try {
            this.winston.silly(this.formatMessage(args));
        } catch (error) {
            console.log(error);
        }
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

