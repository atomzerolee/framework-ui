const _ = require('underscore');
const Events = require('./events');
const utils = require('./utils');
const sync = require('./sync');

const resolveParameters3 = (key, val, options) => {
  let map = {};
  if(key == null) return false;
  if(typeof key === 'object') {
    map = key;
    options = val;
  }else {
    map[key] = val;
  }
  return [map, options || (options = {})];
}

class Model extends Events {
  constructor(attributes, options) {
    super();
    let attrs = attributes || {};
    let opt = _.extend({}, options);
    this.mid = _.uniqueId('m');
    this.attributes = {};
    this.changed = {};
    if(opt.collection) this.collection = options.collection;
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, opt);
    this.initialize.apply(this, arguments);
  }
  // 工具函数
  static isModel(model) {
    return model instanceof Model;
  }
  // 判断主键是否存在
  isNew() {
    return !this.has(this.mainkey);
  }
  toJSON() {
    return _.clone(this.attributes)
  }
  clone() {
    return new this.constructor(this.attributes);
  }
  has(key) {
    return this.get(key) != null;
  }
  matches(keys) {
    return _.matches(keys)(this.attributes);
  }
  hasChanged(attr) {
    if (attr == null) return !_.isEmpty(this.changed);
    return _.has(this.changed, attr);
  }
  previous(attr) {
    if (attr == null || !this._previousAttributes) return null;
    return this._previousAttributes[attr];
  }
  previousAttributes() {
    return _.clone(this._previousAttributes);
  }
  // 返回包含所有已更改属性的对象，如果没有更改属性，则返回false。 
  // 对于需要更新视图的哪些部分和/或需要将哪些属性持久保存到服务器很有用。 
  // 未设置的属性将被设置为未定义。 你也可以传递一个属性对象来与模型进行比较，确定是否会有*变化。
  diff(diff) {
    if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
    let changed = {};
    for(let attr in diff) {
      let val = diff[attr];
      if(_.isEqual(val, this.attributes[attr])) continue;
      changed[attr] = val;
    }
    return _.size(changed) ? changed : false;
  }
  // 数据操作
  set(key, val, options) {
    const args = resolveParameters3.apply(null, arguments);
    let attrs = args.shift();
    options = args.shift();
    if(!attrs) return this;
    
    if(options.parse) attrs = this.parse(attrs);

    this.changed = {}; // 本次set时改变的属性键值对
    this._previousAttributes = _.clone(this.attributes); // 本次set时的所有属性

    let changes = []; // 改变的属性名，触发'change:name'事件
    for(key in attrs) {
      val = attrs[key];
      if(!_.isEqual(val, this.attributes[key])) changes.push(key);
      if(_.isEqual(val, this._previousAttributes[key])) {
        delete this.changed[key];
      }else {
        this.changed[key] = val;
      }
      options.unset ? delete this.attributes[key] : this.attributes[key] = val;
    }

    if(!options.silent) {
      for(let i = 0, len = changes.length; i < len; i++) {
        let propname = changes[i];
        this.emit(`change:${propname}`, this, this.attributes[propname], options);
      }
      // 避免在change事件回掉中调用set而重复调用
      if(changes.length > 0) this._pending = true;
      while(this._pending) {
        this._pending = false;
        this.emit('change', this, options);
      }
    }
    return this;
  }
  unset(key, options) {
    return this.set(attr, void 0, _.extend({}, options, {unset: true}));
  }
  clear(options) {
    var attrs = {};
    for (var key in this.attributes) attrs[key] = void 0;
    return this.set(attrs, void 0, _.extend({}, options, {unset: true}));
  }
  get(key) {
    return this.attributes[key];
  }
  escape(key) { 
    return _.escape(this.get(key));
  }
  // 数据持久化
  url() {
    let base = _.result(this, 'urlRoot')
      || _.result(this.collection, 'url')
      || utils.urlError();
    if (this.isNew()) return base;
    var id = this.get(this.mainkey);
    return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
  }
  sync() {
    return sync.apply(this, arguments);
  }
  // promise
  fetch(options) {
    const resolve = (res) => {
      if(res != null) this.set(res, options);
      this.emit('sync', this, res, options);
    }
    return this.sync('read', this, resolve, options);
  }
  save(key, val, options) {
    let attrs = resolveParameters3.apply(null, arguments);
    options = options || {};
    const attributes = this.attributes; 
    if(attrs && !options.delay) this.set(attrs, options); // 默认先改变，再请求
    const resolve = (res) => {
      if(res != null) {
        if(options.delay) {
          this.set(res);
        }else {
          this.set(this.mainkey, res[this.mainkey], {silent: true});
        }
      }
      this.emit('sync', this, res, options);
    }

    const method = this.isNew() ? 'create' : (options.patch ? 'patch': 'update');
    if(method === 'patch') options.data = attrs;
    return this.sync(method, this, resolve, options);
  }
  destroy(options) {
    options || (options = {});
    const destroy = () => {
      this.stopListening(); // 清除当前模型对其他对象的监听
      this.emit('destroy', this, this.collection, options);
    }

    const resolve = (res) => {
      if(options.delay) destroy();
      if(!this.isNew()) this.emit('sync', this, res, options);
      this.off(); // 在所有事件触发完毕后清除当前对象的事件
    }

    if(!options.delay) destroy();

    // 如果存在id则更新至服务器，不存在移除本地监听
    if(!this.isNew()){
      return this.sync('delete', this, resolve, options);
    }else {
      return this.off(); 
    }
  }
  
  // rewrite
  initialize() {}
  parse(resp) {return resp;} // options.parse == true 每一次set会去触发
}

Model.prototype.mainkey = 'id';

const modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit', 'chain', 'isEmpty'];

_.each(modelMethods, (method) => {
  if (!_[method]) return;
  Model.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.attributes);
    return _[method].apply(_, args);
  };
})

module.exports = Model;