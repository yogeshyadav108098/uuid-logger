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
                message += (' ' + JSON.parse(Stringify(args[i])));
                continue;
            }

            if (typeof args[i] !== 'object') {
                message += (' ' + JSON.parse(Stringify(args[i])));
                continue;
            }

            Object.keys(args[i]).forEach(function(key) {
                message += (' #### ' + key + ': ' + JSON.parse(Stringify(args[i][key])));
            });
        }

        message = requestId ? requestId.toString() + ':' + message : 'Service Logs: ' + message;
        return message;
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
}

module.exports = Logger;

