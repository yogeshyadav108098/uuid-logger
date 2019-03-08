'use strict';

// 3rd Party
const _ = require('lodash');
const Uuid = require('uuid');
const PatchQ = require('cls-q');
const patchRedis = require('cls-redis');
const PatchMysql = require('cls-mysql');
const PatchBlueBird = require('cls-bluebird');
const PatchMongoose = require('cls-mongoose');
const PatchMiddleware = require('cls-middleware');
const CreateNamespace = require('continuation-local-storage').createNamespace;

// Internal
const RequestConfig = require('../config/request');

let session = CreateNamespace(RequestConfig.SESSION_NAME);

PatchQ(session);
patchRedis(session);
PatchMysql(session);
PatchBlueBird(session);
PatchMongoose(session);
PatchMiddleware(session);

class ThreadStorage {
    constructor() { }

    addRequestId(req, res, next) {
        session.run(function() {
            session.set(RequestConfig.REQUEST_IDENTIFIER, req.uuid || Uuid.v4());
            session.set(RequestConfig.REQUEST_URL, _.get(req, 'url', ''));
            return next();
        });
    }

    getRequestId(request) {
        if (!request) {
            return undefined;
        }
        return request.get(RequestConfig.REQUEST_IDENTIFIER);
    }

    getRequestUrl(request) {
        if (!request) {
            return undefined;
        }
        return request.get(RequestConfig.REQUEST_URL);
    }
};

module.exports = ThreadStorage;

