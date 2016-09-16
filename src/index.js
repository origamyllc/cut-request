let uuid = require('uuid');

//  create a request shim
function  request_builder(){
    this.request = {};
}

request_builder.prototype.init = function(req){
    this.generate_uuid(req);
    this.mixin_locals();
    this.get_session_id(req);
    this.get_headers(req);
    this.get_all_params(req);
    this.set_user_agent(req);
    this.request.url = req.url;
    this.request.method = req.method;
    return request ;
}

request_builder.prototype.mixin_locals = function(){
    this.request.env =  process.env.NODE_ENV;
}

request_builder.prototype.generate_uuid = function(req){
    req.headers['x-request-id'] = uuid.v4();
    this.request._id = req.headers['x-request-id'];
}

request_builder.prototype.get_session_id = function(req){
    this.request.session = {};
    if(req.session) {
        this.request.session._id = req.session;
    } else {
        this.request.session._id = uuid.v4();
    }
}

request_builder.prototype.get_headers = function(req){
    let headers = {};
    headers.host = req.headers.host.split(':')[0];
    headers.port = req.headers.host.split(':')[1];
    headers['content-type'] = req.headers['content-type'];
    headers['authorization'] = req.headers['authorization'];
    this.request.headers = headers;
}

request_builder.prototype.get_all_params = function(req){
    let body = {};
    if( req.body ){
        body = req.body;
    }
    else if (req.params){
        body = req.params;
    }
    else if (req.query){
        body = req.params;
    }
    this.request.body = body;
}

request_builder.prototype.set_user_agent = function(req){

    let user_agent = {};

    user_agent.browser =  req.useragent.browser;
    user_agent.version = req.useragent.version;
    user_agent.os = req.useragent.os;
    user_agent.platform = req.useragent.platform;
    this.request.user_agent = user_agent;
}

const $request_builder = new request_builder();

export function  cut_request(req, res, next){
    req.request = $request_builder.init(req);
    next();
}
