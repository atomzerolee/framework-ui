const $ = require('jquery');
const utils = require('./utils');

const methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE',
  'read': 'GET'
}

/**
 * UI.sync 同步方法
 * @param {string} method 同步请求方法类型 
 * @param {*} model 触发同步数据的模型，可能将该模型发送至服务器
 * @param {*} resolve 请求响应之后的处理函数
 * @param {*} options 请求的一下配置
 */
const sync = function(method, model, resolve, options) {
  const type = methodMap[method];

  _.defaults(options || (options = {}), {
    emulateHTTP: sync.emulateHTTP,
    emulateJSON: sync.emulateJSON
  });

  let params = {type: type, dataType: 'json'};
  // 确定必需居右url
  if (!options.url) {
    const host = sync.host || '';
    params.url = _.result(model, 'url') || utils.urlError();
    params.url = host + params.url;
  }
  // 不存在参数，则发送当前model作为参数
  if(options.data == null && model 
    && (method === 'create' || method === 'update' || method === 'patch')) {
    params.contentType = 'application/json';
    params.data = JSON.stringify(model.toJSON());
  }

  if(options.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = params.data ? {model: params.data} : {};
  }

  if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
    params.type = 'POST';
    if (options.emulateJSON) params.data._method = type;
    var beforeSend = options.beforeSend;
    options.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-HTTP-Method-Override', type);
      if (beforeSend) return beforeSend.apply(this, arguments);
    };
  }
  
  // 不要在非GET请求上处理数据
  if (params.type !== 'GET' && !options.emulateJSON) {
    params.processData = false;
  }

  options.error = function(xhr, textStatus, errorThrown) {
    options.textStatus = textStatus;
    options.errorThrown = errorThrown;
    sync.onError.call(null, xhr, textStatus, errorThrown);
    model.emit('error', xhr, textStatus, errorThrown);
  };

  options.dataFilter = sync.onData;

  if(_.isFunction(resolve)) 
    options.success = resolve;
  
  const xhr = $.ajax(_.extend(params, options));
  model.emit('request', model, xhr, options);
  return xhr;
}

sync.emulateHTTP = false;
sync.emulateJSON = false;

// 请求响应数据解析,ajax.dataFilter
sync.onData = function(resp, xhr) {
  console.log(typeof resp);
  return resp;
}
// 请求错误 执行完毕后model触发 ‘error’ 事件
sync.onError = function(xhr, textStatus, errorThrown) {
  throw new Error(`UI.sync Capture an ajax's error: ${textStatus}`);
}

module.exports = sync;