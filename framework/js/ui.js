/**
 * framework-ui - 后台数据管理界面UI及JavaScript-MVC框架
 * @version v1.0.1
 * @author atomzerolee
 * @url git+https://github.com/atomzerolee/framework-ui.git
 * @package private
 * @license Apache-2.0
 */
define(function(require, exports, module) {
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("jquery"), require("nunjucks"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "jquery", "nunjucks"], factory);
	else if(typeof exports === 'object')
		exports["UI"] = factory(require("underscore"), require("jquery"), require("nunjucks"));
	else
		root["UI"] = factory(root["underscore"], root["jquery"], root["nunjucks"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = __webpack_require__(1);

var eventSplitter = /\s+/;

// 处理eventMap 'event event'
var eventsFactory = function eventsFactory(obj, action, name, rest) {
  if (!name) return true;
  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
    for (var key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest));
    }
    return false;
  }
  if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter);
    for (var i = 0, len = names.length; i < len; i++) {
      obj[action].apply(obj, [names[i]].concat(rest));
    }
    return false;
  }
  return true;
};

// 存在this指向时，call的性能明显优于apply
var emitEvents = function emitEvents(events, args) {
  var ev = void 0,
      i = -1,
      len = events.length;
  switch (args.length) {
    case 0:
      while (++i < len) {
        (ev = events[i]).callback.call(ev.ctx);
      }return;
    case 1:
      while (++i < len) {
        (ev = events[i]).callback.call(ev.ctx, args[0]);
      }return;
    case 2:
      while (++i < len) {
        (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
      }return;
    case 3:
      while (++i < len) {
        (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
      }return;
    default:
      while (++i < len) {
        (ev = events[i]).callback.apply(ev.ctx, args);
      }return;
  }
};

var Events = function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  _createClass(Events, [{
    key: 'on',
    value: function on(name, callback, context) {
      if (!eventsFactory(this, 'on', name, [callback, context]) || !callback) return this;
      if (!this._events) this._events = {};
      var events = this._events[name] || (this._events[name] = []);
      events.push({ callback: callback, context: context, ctx: context || this });
      return this;
    }
  }, {
    key: 'once',
    value: function once(name, callback, context) {
      if (!eventsFactory(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function () {
        self.off(name, once); // 停止监听
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    }
  }, {
    key: 'off',
    value: function off(name, callback, context) {
      if (!this._events || !eventsFactory(this, 'off', name, [callback, context])) {
        return this;
      }
      // 清空所有事件
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }

      var names = name ? [name] : _.keys(this.events);
      for (var i = 0, len = names.length; i < len; i++) {
        name = names[i];
        var events = this._events[name];
        if (!events) continue;

        if (!callback && !context) {
          // 清除该事件所有回调
          delete this._events[name];
          continue;
        }

        var remaining = [];
        for (var j = 0, elength = events.length; j < elength; j++) {
          var event = events[i];
          // callback或context与event定义时不匹配，则不删除event
          if (callback && callback !== event.callback && callback !== event.callback._callback // 处理 once
          || context && context !== event.context) {
            remaining.push(event);
          }
        }
        //重新赋值 _event.name 数组。不使用splice()方法
        if (remaining.length) {
          this._events[name] = remaining;
        } else {
          delete this._events[name];
        }
      }
      return this;
    }
  }, {
    key: 'emit',
    value: function emit(name) {
      if (!this._events) {
        return this;
      }
      var args = [].slice.call(arguments, 1);
      if (!eventsFactory(this, 'emit', name, args)) {
        return this;
      }
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) {
        emitEvents(events, args);
      }
      if (allEvents) {
        emitEvents(allEvents, arguments);
      }
      return this;
    }
    // 当前对象监听obj对象的事件, obj对象存在一个_listenId, 当前对象存在一个对_listeningTo 保持对obj对象的引用

  }, {
    key: 'listenTo',
    value: function listenTo(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      if (!obj._listenId) {
        obj._listenId = _.uniqueId('l');
      }
      var id = obj._listenId;
      listeningTo[id] = obj;
      // 当name为对象，callback为undefined 则为 obj.on的第二个参数 context
      if (!callback && (typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') callback = this;
      // name为对象则将callback指定为this，否则为真实callback回调
      // 不论name是否为对象，callback的 context 指向都为当前监听对象this，而不是被监听对象obj
      obj.on(name, callback, this);
      return this;
    }
  }, {
    key: 'listenToOnce',
    value: function listenToOnce(obj, name, callback) {
      if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
        for (var event in name) {
          this.listeningToOnce(obj, event, event, name[event]);
        }
        return this;
      }
      if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, len = names.length; i < len; i++) {
          this.listenToOnce(obj, names[i], callback);
        }
        return this;
      }
      if (!callback) return this;
      var self = this;
      var once = _.once(function () {
        self.stopListening(obj, name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.listenTo(obj, name, once);
    }
  }, {
    key: 'stopListening',
    value: function stopListening(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && (typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') callback = this;
      if (obj) {
        listeningTo = {};
        listeningTo[obj._listenId] = obj;
      }
      for (var id in listeningTo) {
        obj = listeningTo[id];
        if (!name && !callback) {
          obj.off();
        } else {
          obj.off(name, callback, this);
        }
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }
  }]);

  return Events;
}();

Events.prototype.bind = Events.prototype.on;
Events.prototype.unbind = Events.prototype.off;

module.exports = Events;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = __webpack_require__(1);
var Events = __webpack_require__(0);
var utils = __webpack_require__(5);
var _sync = __webpack_require__(3);

var resolveParameters3 = function resolveParameters3(key, val, options) {
  var map = {};
  if (key == null) return false;
  if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
    map = key;
    options = val;
  } else {
    map[key] = val;
  }
  return [map, options || (options = {})];
};

var Model = function (_Events) {
  _inherits(Model, _Events);

  function Model(attributes, options) {
    _classCallCheck(this, Model);

    var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

    var attrs = attributes || {};
    var opt = _.extend({}, options);
    _this.mid = _.uniqueId('m');
    _this.attributes = {};
    _this.changed = {};
    if (opt.collection) _this.collection = options.collection;
    attrs = _.defaults({}, attrs, _.result(_this, 'defaults'));
    _this.set(attrs, opt);
    _this.initialize.apply(_this, arguments);
    return _this;
  }
  // 工具函数


  _createClass(Model, [{
    key: 'isNew',

    // 判断主键是否存在
    value: function isNew() {
      return !this.has(this.mainkey);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return _.clone(this.attributes);
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new this.constructor(this.attributes);
    }
  }, {
    key: 'has',
    value: function has(key) {
      return this.get(key) != null;
    }
  }, {
    key: 'matches',
    value: function matches(keys) {
      return _.matches(keys)(this.attributes);
    }
  }, {
    key: 'hasChanged',
    value: function hasChanged(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    }
  }, {
    key: 'previous',
    value: function previous(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    }
  }, {
    key: 'previousAttributes',
    value: function previousAttributes() {
      return _.clone(this._previousAttributes);
    }
    // 返回包含所有已更改属性的对象，如果没有更改属性，则返回false。 
    // 对于需要更新视图的哪些部分和/或需要将哪些属性持久保存到服务器很有用。 
    // 未设置的属性将被设置为未定义。 你也可以传递一个属性对象来与模型进行比较，确定是否会有*变化。

  }, {
    key: 'diff',
    value: function diff(_diff) {
      if (!_diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var changed = {};
      for (var _attr in _diff) {
        var val = _diff[_attr];
        if (_.isEqual(val, this.attributes[_attr])) continue;
        changed[_attr] = val;
      }
      return _.size(changed) ? changed : false;
    }
    // 数据操作

  }, {
    key: 'set',
    value: function set(key, val, options) {
      var args = resolveParameters3.apply(null, arguments);
      var attrs = args.shift();
      options = args.shift();
      if (!attrs) return this;

      if (options.parse) attrs = this.parse(attrs);

      this.changed = {}; // 本次set时改变的属性键值对
      this._previousAttributes = _.clone(this.attributes); // 本次set时的所有属性

      var changes = []; // 改变的属性名，触发'change:name'事件
      for (key in attrs) {
        val = attrs[key];
        if (!_.isEqual(val, this.attributes[key])) changes.push(key);
        if (_.isEqual(val, this._previousAttributes[key])) {
          delete this.changed[key];
        } else {
          this.changed[key] = val;
        }
        options.unset ? delete this.attributes[key] : this.attributes[key] = val;
      }

      if (!options.silent) {
        for (var i = 0, len = changes.length; i < len; i++) {
          var propname = changes[i];
          this.emit('change:' + propname, this, this.attributes[propname], options);
        }
        // 避免在change事件回掉中调用set而重复调用
        if (changes.length > 0) this._pending = true;
        while (this._pending) {
          this._pending = false;
          this.emit('change', this, options);
        }
      }
      return this;
    }
  }, {
    key: 'unset',
    value: function unset(key, options) {
      return this.set(attr, void 0, _.extend({}, options, { unset: true }));
    }
  }, {
    key: 'clear',
    value: function clear(options) {
      var attrs = {};
      for (var key in this.attributes) {
        attrs[key] = void 0;
      }return this.set(attrs, void 0, _.extend({}, options, { unset: true }));
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.attributes[key];
    }
  }, {
    key: 'escape',
    value: function escape(key) {
      return _.escape(this.get(key));
    }
    // 数据持久化

  }, {
    key: 'url',
    value: function url() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || utils.urlError();
      if (this.isNew()) return base;
      var id = this.get(this.mainkey);
      return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
    }
  }, {
    key: 'sync',
    value: function sync() {
      return _sync.apply(this, arguments);
    }
    // promise

  }, {
    key: 'fetch',
    value: function fetch(options) {
      var _this2 = this;

      var resolve = function resolve(res) {
        if (res != null) _this2.set(res, options);
        _this2.emit('sync', _this2, res, options);
      };
      return this.sync('read', this, resolve, options);
    }
  }, {
    key: 'save',
    value: function save(key, val, options) {
      var _this3 = this;

      var attrs = resolveParameters3.apply(null, arguments);
      options = options || {};
      var attributes = this.attributes;
      if (attrs && !options.delay) this.set(attrs, options); // 默认先改变，再请求
      var resolve = function resolve(res) {
        if (res != null) {
          if (options.delay) {
            _this3.set(res);
          } else {
            _this3.set(_this3.mainkey, res[_this3.mainkey], { silent: true });
          }
        }
        _this3.emit('sync', _this3, res, options);
      };

      var method = this.isNew() ? 'create' : options.patch ? 'patch' : 'update';
      if (method === 'patch') options.data = attrs;
      return this.sync(method, this, resolve, options);
    }
  }, {
    key: 'destroy',
    value: function destroy(options) {
      var _this4 = this;

      options || (options = {});
      var destroy = function destroy() {
        _this4.stopListening(); // 清除当前模型对其他对象的监听
        _this4.emit('destroy', _this4, _this4.collection, options);
      };

      var resolve = function resolve(res) {
        if (options.delay) destroy();
        if (!_this4.isNew()) _this4.emit('sync', _this4, res, options);
        _this4.off(); // 在所有事件触发完毕后清除当前对象的事件
      };

      if (!options.delay) destroy();

      // 如果存在id则更新至服务器，不存在移除本地监听
      if (!this.isNew()) {
        return this.sync('delete', this, resolve, options);
      } else {
        return this.off();
      }
    }

    // rewrite

  }, {
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'parse',
    value: function parse(resp) {
      return resp;
    } // options.parse == true 每一次set会去触发

  }], [{
    key: 'isModel',
    value: function isModel(model) {
      return model instanceof Model;
    }
  }]);

  return Model;
}(Events);

Model.prototype.mainkey = 'id';

var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'chain', 'isEmpty'];

_.each(modelMethods, function (method) {
  if (!_[method]) return;
  Model.prototype[method] = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.attributes);
    return _[method].apply(_, args);
  };
});

module.exports = Model;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var $ = __webpack_require__(4);
var utils = __webpack_require__(5);

var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE',
  'read': 'GET'

  /**
   * UI.sync 同步方法
   * @param {string} method 同步请求方法类型 
   * @param {*} model 触发同步数据的模型，可能将该模型发送至服务器
   * @param {*} resolve 请求响应之后的处理函数
   * @param {*} options 请求的一下配置
   */
};var sync = function sync(method, model, resolve, options) {
  var type = methodMap[method];

  _.defaults(options || (options = {}), {
    emulateHTTP: sync.emulateHTTP,
    emulateJSON: sync.emulateJSON
  });

  var params = { type: type, dataType: 'json' };
  // 确定必需居右url
  if (!options.url) {
    var host = sync.host || '';
    params.url = _.result(model, 'url') || utils.urlError();
    params.url = host + params.url;
  }
  // 不存在参数，则发送当前model作为参数
  if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    params.contentType = 'application/json';
    params.data = JSON.stringify(model.toJSON());
  }

  if (options.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = params.data ? { model: params.data } : {};
  }

  if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
    params.type = 'POST';
    if (options.emulateJSON) params.data._method = type;
    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('X-HTTP-Method-Override', type);
      if (beforeSend) return beforeSend.apply(this, arguments);
    };
  }

  // 不要在非GET请求上处理数据
  if (params.type !== 'GET' && !options.emulateJSON) {
    params.processData = false;
  }

  options.error = function (xhr, textStatus, errorThrown) {
    options.textStatus = textStatus;
    options.errorThrown = errorThrown;
    sync.onError.call(null, xhr, textStatus, errorThrown);
    model.emit('error', xhr, textStatus, errorThrown);
  };

  options.dataFilter = sync.onData;

  if (_.isFunction(resolve)) options.success = resolve;

  var xhr = $.ajax(_.extend(params, options));
  model.emit('request', model, xhr, options);
  return xhr;
};

sync.emulateHTTP = false;
sync.emulateJSON = false;

// 请求响应数据解析,ajax.dataFilter
sync.onData = function (resp, xhr) {
  console.log(typeof resp === 'undefined' ? 'undefined' : _typeof(resp));
  return resp;
};
// 请求错误 执行完毕后model触发 ‘error’ 事件
sync.onError = function (xhr, textStatus, errorThrown) {
  throw new Error('UI.sync Capture an ajax\'s error: ' + textStatus);
};

module.exports = sync;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  urlError: function urlError() {
    throw new Error('A "url" property or function must be specified');
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = __webpack_require__(1);
var Model = __webpack_require__(2);
var Event = __webpack_require__(0);
var _sync = __webpack_require__(3);

var resolveParameters = function resolveParameters(models, options) {
  if (models == null) return;
  options = _.extend({}, options);
  if (options.parse && !Model.isModel(models)) {
    models = this.parse(models, options) || {};
  }

  var isArray = _.isArray(models);
  return [isArray ? models : [models], options];
};

var splice = function splice(array, insert, at) {
  at = Math.min(Math.max(at, 0), array.length);
  var tails = Array(array.length - at);
  var length = insert.length;
  for (var i = 0; i < tails.length; i++) {
    tails[i] = array[i + at];
  }for (var _i = 0; _i < length; _i++) {
    array[_i + at] = insert[_i];
  }for (var _i2 = 0; _i2 < tails.length; _i2++) {
    array[_i2 + length + at] = tails[_i2];
  }
};

var Collection = function (_Event) {
  _inherits(Collection, _Event);

  function Collection(models, options) {
    _classCallCheck(this, Collection);

    var _this = _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).call(this));

    options || (options = {});
    if (options.comparator != void 0) {
      _this.comparator = options.comparator;
    }
    _this._reset();
    _this.initialize.apply(_this, arguments);
    if (models) _this.reset(models, _.extend({ silent: true }, options));
    return _this;
  }

  _createClass(Collection, [{
    key: '_reset',
    value: function _reset() {
      this.length = 0;
      this.models = [];
      this._ref = {};
    }
  }, {
    key: '_addReference',
    value: function _addReference(model) {
      this._ref[model.mid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._ref[id] = model;
      model.on('all', this._onModelEvent, this);
    }
  }, {
    key: '_removeReference',
    value: function _removeReference(model) {
      delete this._ref[model.mid];
      var id = this.modelId(model.attributes);
      if (id != null) delete this._ref[id];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    }
  }, {
    key: '_onModelEvent',
    value: function _onModelEvent(event, model, collection, options) {
      if (model) {
        if ((event === 'add' || event === 'remove') && collection !== this) {
          return;
        }
        if (event === 'destroy') {
          this.remove(model, options);
        }
        if (event === 'change') {
          var prevId = this.modelId(model.previousAttributes());
          var id = this.modelId(model.attributes);
          if (prevId !== id) {
            if (prevId != null) delete this._ref[prevId];
            if (id != null) this._ref[id] = model;
          }
        }
      }
      this.emit.apply(this, arguments);
    }
  }, {
    key: '_prepareModel',
    value: function _prepareModel(attrs, options) {
      if (Model.isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = _.extend({ collection: this }, options);
      return new this.model(attrs, options);
    }
  }, {
    key: '_removeModels',
    value: function _removeModels(models, options) {
      var removed = [];
      for (var i = 0; i < models.length; i++) {
        var model = this.get(models[i]);
        if (!model) continue;

        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;

        // 先清除引用，用于触发‘remove’事件传递的collection
        delete this._ref[model.cid];
        var id = this.modelId(model.attributes);
        if (id != null) delete this._ref[id];

        if (!options.silent) {
          options.index = index;
          model.emit('remove', model, this, options);
        }

        removed.push(model);
        // 清除事件监听
        this._removeReference(model, options);
      }
      return removed;
    }
    // tools

  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.map(function (model) {
        return model.toJSON();
      });
    }
  }, {
    key: 'modelId',
    value: function modelId(attributes) {
      return attributes[this.model.prototype.mainkey];
    }
  }, {
    key: 'slice',
    value: function slice() {
      return Array.prototype.slice.apply(this.models, arguments);
    }
  }, {
    key: 'pluck',
    value: function pluck(attr) {
      return _.invoke(this.models, 'get', attr);
    }
  }, {
    key: 'has',
    value: function has(obj) {
      return this.get(obj) != null;
    }
    // data operator

  }, {
    key: 'reset',
    value: function reset(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        var model = this.models[i];
        this._removeReference(model);
      }
      this._reset();
      models = this.add(models, _.extend({ silent: true }, options));
      if (!options.silent) this.emit('reset', this, options);
      return this;
    }
  }, {
    key: 'add',
    value: function add(models, options) {
      var args = resolveParameters.apply(this, arguments);
      models = args.shift();
      options = args.shift();

      var toAdd = [];
      var at = options.at != null ? +options.at : void 0;
      if (at < 0) at += this.length + 1;

      var i = 0,
          model = void 0;
      for (; i < models.length; i++) {
        model = models[i];
        var exsiting = this.get(model);
        if (!exsiting) {
          model = this._prepareModel(model, options);
          if (model) {
            toAdd.push(model);
            this._addReference(model, options);
          }
        } else {
          continue;
        }
      }

      if (toAdd.length > 0) {
        splice(this.models, toAdd, at == null ? this.length : at);
        this.length = this.models.length;
      }

      if (!options.silent) {
        for (var _i3 = 0; _i3 < toAdd.length; _i3++) {
          if (at != null) options.index = at + _i3;
          model = toAdd[_i3];
          model.emit('add', model, this, options);
        }
      }

      return this;
    }
  }, {
    key: 'set',
    value: function set(models, options) {
      var args = resolveParameters.apply(this, arguments);
      models = args.shift();
      options = args.shift();

      var i = 0,
          model = void 0,
          toUpdate = [];
      for (; i < models.length; i++) {
        model = models[i];
        var exsiting = this.get(model);
        if (exsiting && model !== exsiting) {
          delete model.mid;
          var attrs = Model.isModel(model) ? model.attributes : model;
          exsiting.set(attrs, options);
          toUpdate.push(exsiting);
        } else {
          continue;
        }
      }
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(models, options) {
      var args = resolveParameters.apply(this, arguments);
      models = args.shift();
      options = args.shift();
      return this._removeModels(models, options);
    }
  }, {
    key: 'get',
    value: function get(obj) {
      if (obj == null) return void 0;
      return this._ref[obj] || this._ref[this.modelId(obj.attributes || obj)] || obj.mid && this._ref[obj.mid];
    }
  }, {
    key: 'at',
    value: function at(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    }
  }, {
    key: 'where',
    value: function where(attrs, first) {
      var matcher = _.matcher(attrs);
      return this[first ? 'find' : 'filter'](function (model) {
        return matcher(model.attributes);
      });
    }
    // sync

  }, {
    key: 'sync',
    value: function sync() {
      return _sync.apply(this, arguments);
    }
  }, {
    key: 'fetch',
    value: function fetch(options) {
      var _this2 = this;

      options = _.extend({ parse: true }, options);
      var resolve = function resolve(res) {
        if (res != null) _this2.reset(res, options);
        _this2.emit('sync', _this2, res, options);
      };
      return this.sync('read', this, resolve, options);
    }
  }, {
    key: 'create',
    value: function create(model, options) {
      var _this3 = this;

      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.delay) this.add(model, options);
      var resolve = function resolve(res) {
        if (options.delay) _this3.add(res, options);
      };
      model.save(null, options);
      return model;
    }
    // rewrite

  }, {
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'parse',
    value: function parse(resp) {
      return resp;
    }
  }], [{
    key: 'isCollection',
    value: function isCollection(collection) {
      return collection instanceof Collection;
    }
  }]);

  return Collection;
}(Event);

// 扩展underscore原型方法


var collectionMethodMap = ['filter', 'find', 'indexOf', 'last', 'first', 'each', 'map', 'chain'];
var modelsMethodMap = ['groupBy', 'countBy', 'sortBy', 'indexBy'];
_.each(collectionMethodMap, function (method) {
  if (!_[method]) return;
  Collection.prototype[method] = function () {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(this.models);
    return _[method].apply(_, args);
  };
});
_.each(modelsMethodMap, function (method) {
  if (!_[method]) return;
  Collection.prototype[method] = function (value, context) {
    var iterator = _.isFunction(value) ? value : function (model) {
      return model.get(value);
    };
    return _[method](this.models, iterator, context);
  };
});

Collection.splice = splice;

module.exports = Collection;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nunjucks = __webpack_require__(9);
var Events = __webpack_require__(0);
var $ = __webpack_require__(4);
var Model = __webpack_require__(2);
var Collection = __webpack_require__(6);

// options支持函数
var viewOptions = ['template', 'model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];
var viewSpliter = /^.*\.(njk)$/;

// addFilter未验证

var View = function (_Events) {
  _inherits(View, _Events);

  function View(options) {
    _classCallCheck(this, View);

    var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));

    options || (options = _.extend({}, options));
    _this.vid = _.uniqueId('v');
    _.extend(_this, _.pick(options, viewOptions));
    _this._ensureElement(); //绑定el
    _this.initialize.apply(_this, arguments); // 初始化添加别的监听
    if (!options.unbind) {
      // 是否自动绑定
      _this._bindEvents(); // 绑定对应model事件
    }
    return _this;
  }

  _createClass(View, [{
    key: '_createElement',

    // Dom相关
    value: function _createElement(tagName) {
      return document.createElement(tagName);
    }
  }, {
    key: '_ensureElement',
    value: function _ensureElement() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this._setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this._setElement(_.result(this, 'el'));
      }
    }
  }, {
    key: '_setAttributes',
    value: function _setAttributes(attributes) {
      this.$el.attr(attributes);
    }
  }, {
    key: '_setElement',
    value: function _setElement(ele) {
      this.$el = ele instanceof $ ? ele : $(ele);
      this.el = this.$el[0];
    }
  }, {
    key: '_removeElement',
    value: function _removeElement() {
      this.$el.remove();
    }
  }, {
    key: '$',
    value: function $(selector) {
      return this.$el.find(selector);
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.stopListening();
      this._removeElement();
      return this;
    }
    // data数据层事件监听，触发渲染

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      if (Model.isModel(this.model)) {
        this.listenTo(this.model, 'change', this.render);
      }
      if (Collection.isCollection(this.collection)) {
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(this.collection, 'add', this.render);
      }
    }
    // 模板相关 编译渲染为字符串 渲染为dom

  }, {
    key: 'compile',
    value: function compile(data) {
      var model = this.model && this.model.toJSON();
      var collection = this.collection && this.collection.toJSON();
      data = _.clone(data) || model || collection;
      if (data == null || !viewSpliter.test(this.template)) return null;
      data = this.parse(data);
      return this.env.render(this.template, _.isArray(data) ? { data: data } : data);
    }
  }, {
    key: 'render',
    value: function render() {
      var _html = this.compile();
      if (_html != null) {
        this.$el.html(_html);
      }
      return this.$el;
    }
    // rewrite
    // 渲染过滤

  }, {
    key: 'parse',
    value: function parse(resp) {
      return resp;
    }
  }, {
    key: 'initialize',
    value: function initialize() {}
  }], [{
    key: 'isView',
    value: function isView(view) {
      return view instanceof View;
    }
  }]);

  return View;
}(Events);

View.prototype.env = new nunjucks.Environment();
View.prototype.tagName = 'div';

module.exports = View;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = __webpack_require__(1);
var Events = __webpack_require__(0);
var Model = __webpack_require__(2);
var Collection = __webpack_require__(6);
var View = __webpack_require__(7);
var Controller = __webpack_require__(10);
var sync = __webpack_require__(3);

var UI = function (_Events) {
  _inherits(UI, _Events);

  function UI() {
    _classCallCheck(this, UI);

    var _this = _possibleConstructorReturn(this, (UI.__proto__ || Object.getPrototypeOf(UI)).call(this));

    _this.Model = Model;
    _this.Collection = Collection;
    _this.View = View;
    _this.Controller = Controller;
    _this.sync = sync;
    _this.Model.extend = _this.Collection.extend = _this.View.extend = _this.Controller.extend = _this.extends;
    return _this;
  }

  _createClass(UI, [{
    key: 'extends',
    value: function _extends(protoProps, staticProps) {
      var parent = this;
      var child = void 0;
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function child() {
          return parent.apply(this, arguments);
        };
      }
      _.extend(child, parent, staticProps);
      child.prototype = _.create(parent.prototype, protoProps);
      child.prototype.constructor = child;
      child.__super__ = parent.prototype;
      return child;
    }
  }]);

  return UI;
}(Events);

module.exports = new UI();

if (window) window.UI = module.exports;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = __webpack_require__(4);
var Events = __webpack_require__(0);
var View = __webpack_require__(7);

// {'click .selector': 'method'}
var delegateEventSplitter = /^(\S+)\s*(.*)$/;

var Controller = function (_Events) {
  _inherits(Controller, _Events);

  function Controller() {
    _classCallCheck(this, Controller);

    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this));

    _this.initialize.apply(_this, arguments); // 挂载view model
    if (View.isView(_this.view) && !_this._unbind) {
      // _unbind 不自动绑定
      _this.delegateEvents();
    }
    return _this;
  }

  _createClass(Controller, [{
    key: 'delegateEvents',
    value: function delegateEvents(events) {
      events || (events = _.result(this, 'events'));
      if (!events) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
    }
  }, {
    key: 'delegate',
    value: function delegate(eventName, selector, listener, data) {
      data = _.clone(data) || data;
      this.view.$el.on(eventName + '.delegateEvents' + this.view.vid, selector, data, listener);
      return this;
    }
  }, {
    key: 'undelegateEvents',
    value: function undelegateEvents() {
      if (this.view.$el) this.view.$el.off('.delegateEvents' + this.view.cid);
      return this;
    }
  }, {
    key: 'undelegate',
    value: function undelegate(eventName, selector, listener) {
      this.view.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.undelegateEvents();
      this.stopListening();
      this.view = null;
    }
    // 构造函数

  }, {
    key: 'initialize',
    value: function initialize() {}
  }]);

  return Controller;
}(Events);

module.exports = Controller;

/***/ })
/******/ ]);
});
})