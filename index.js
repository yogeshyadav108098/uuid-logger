'use strict';

const _ = require('lodash');
const Uuid = require('uuid');
const Path = require('path');
const Winston = require('winston');
require('winston-daily-rotate-file');
const Datetime = require('node-datetime');
const SlackHook = require('winston-slack-advanced');

const ThreadStorage = new (require('./lib/threadStorage'))();

let logger;
let timeFormat = () => (new Datetime.create()).format('Y-m-d H:m:S.MS');

// Remove default console writer
try {
    Winston.remove(Winston.transports.Console);
} catch (error) {

}


class Main {
    constructor() {
        this.transports = 0;
    }

    addRequestId(req, res, next) {
        return ThreadStorage.addRequestId(req, res, next);
    }

    getLogger() {
        if (logger) {
            return logger;
        }

        if (!this.transports) {
            throw new Error('Please add some transports first');
        }

        logger = new (require('./lib/logger'))({
            winston: Winston
        });
        return logger;
    }

    addTransport(options) {
        if (options.console) {
            Winston.add(Winston.transports.Console, {
                name: options.console.name || 'Console Logger - ' + Uuid.v4(),
                level: options.console.level || 'info',
                colorize: options.console.colorize || true,
                timestamp: options.console.timeFormat || timeFormat
            });
            this.transports += 1;
        }

        if (options.file) {
            let fileName = _.get(options, 'file.fileName');
            let filePath = _.get(options, 'file.filePath');

            if (!fileName || !filePath) {
                throw new Error(
                    'Filename and Filepath are not provided, so file transport could not be added'
                );
            }

            Winston.add(Winston.transports.DailyRotateFile, {
                name: options.file.name || 'File Logger - ' + Uuid.v4(),
                filename: Path.join(filePath, fileName),
                level: options.file.level || 'info',
                colorize: options.file.colorize || false,
                timestamp: options.file.timeFormat || timeFormat,
                json: options.file.json || false,
                zippedArchive: options.file.zippedArchive || true,
                maxDays: options.file.maxDays || 15
            });
            this.transports += 1;
        }

        if (options.slack) {
            let webHookUrl = _.get(options, 'slack.webHookUrl');
            let channel = _.get(options, 'slack.channel');
            let username = _.get(options, 'slack.username');

            if (!webHookUrl || !channel || !username) {
                throw new Error(
                    'webookUrl, channel, username are not provided, so slack transport could not be added'
                );
            }

            Winston.add(SlackHook, {
                name: options.slack.name || 'Slack Logger - ' + Uuid.v4(),
                webHookUrl: options.slack.webHookUrl,
                channel: options.slack.channel,
                username: options.slack.username || 'Bot - ' + Uuid.v4().slice(0, 7),
                level: options.slack.level || 'info',
                handleExceptions: true
            });
            this.transports += 1;
        }
    }
}

module.exports = Main;
