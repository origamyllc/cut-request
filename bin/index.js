'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cut_request = cut_request;
//  create a request shim
function request_builder() {
    this.request = {};
}

request_builder.prototype.init = function (req) {
    this.generate_uuid(req);
    this.mixin_locals();
    this.get_session_id(req);
    this.get_headers(req);
    this.get_all_params(req);
    this.set_user_agent(req);
    this.request.url = req.url;
    this.request.method = req.method;
};

request_builder.prototype.mixin_locals = function () {
    app.locals.env = process.env.NODE_ENV;
    this.request.env = app.locals.env;
};

request_builder.prototype.generate_uuid = function (req) {
    req.headers['x-request-id'] = uuid.v4();
    this.request._id = req.headers['x-request-id'];
};

request_builder.prototype.get_session_id = function (req) {
    this.request.session = {};
    if (req.session) {
        this.request.session._id = req.session;
    } else {
        this.request.session._id = uuid.v4();
    }
};

request_builder.prototype.get_headers = function (req) {
    var headers = {};
    headers.host = req.headers.host.split(':')[0];
    headers.port = req.headers.host.split(':')[1];
    headers['content-type'] = req.headers['content-type'];
    headers['authorization'] = req.headers['authorization'];
    this.request.headers = headers;
};

request_builder.prototype.get_all_params = function (req) {
    var body = {};
    if (req.body) {
        body = req.body;
    } else if (req.params) {
        body = req.params;
    } else if (req.query) {
        body = req.params;
    }
    this.request.body = body;
};

request_builder.prototype.set_user_agent = function (req) {

    var user_agent = {};

    user_agent.browser = req.useragent.browser;
    user_agent.version = req.useragent.version;
    user_agent.os = req.useragent.os;
    user_agent.platform = req.useragent.platform;
    this.request.user_agent = user_agent;
};

var $request_builder = new request_builder();

function cut_request(req, res, next) {
    $request_builder.init(req);
    next();
}