const _ = require('underscore');
const Model = require('./model');
const Event = require('./events');
const sync = require('./sync');

const resolveParameters = function(models, options) {
  if(models == null) return;
  options = _.extend({}, options);
  if(options.parse && !Model.isModel(models)) {
    models = this.parse(models, options) || {};
  }

  const isArray = _.isArray(models);
  return [isArray ? models : [models], options];
}

const splice = (array, insert, at) => {
  at = Math.min(Math.max(at, 0), array.length);
  let tails = Array(array.length - at);
  let length = insert.length;
  for(let i = 0; i < tails.length; i++) tails[i] = array[i + at];
  for(let i = 0; i < length; i++) array[i + at] = insert[i];
  for(let i = 0; i < tails.length; i++) array[i + length + at] = tails[i];
}

class Collection extends Event {
  constructor(models, options) {
    super();
    options || (options ={});
    if(options.comparator != void 0) {
      this.comparator = options.comparator;
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if(models) this.reset(models, _.extend({silent: true}, options));
  }
  static isCollection(collection) {
    return collection instanceof Collection;
  }
  _reset() {
    this.length = 0;
    this.models = [];
    this._ref = {};
  }
  _addReference(model) {
    this._ref[model.mid] = model;
    const id = this.modelId(model.attributes);
    if(id != null) this._ref[id] = model;
    model.on('all', this._onModelEvent, this);
  }
  _removeReference(model) {
    delete this._ref[model.mid];
    const id = this.modelId(model.attributes);
    if(id != null) delete this._ref[id];
    if (this === model.collection) delete model.collection;
    model.off('all', this._onModelEvent, this);
  }
  _onModelEvent(event, model, collection, options) {
    if(model) {
      if((event === 'add' || event === 'remove') && collection !== this) {
        return;
      }
      if(event === 'destroy') {
        this.remove(model, options);
      }
      if(event === 'change') {
        const prevId = this.modelId(model.previousAttributes());
        var id = this.modelId(model.attributes);
        if (prevId !== id) {
          if (prevId != null) delete this._ref[prevId];
          if (id != null) this._ref[id] = model;
        }
      }
    }
    this.emit.apply(this, arguments);
  }
  _prepareModel(attrs, options) {
    if (Model.isModel(attrs)) {
      if (!attrs.collection) attrs.collection = this;
      return attrs;
    }
    options = _.extend({collection: this}, options);
    return new this.model(attrs, options);
  }
  _removeModels(models, options) {
    var removed = [];
    for (var i = 0; i < models.length; i++) {
      var model = this.get(models[i]);
      if (!model) continue;

      const index = this.indexOf(model);
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
  toJSON() {
    return this.map(model => model.toJSON());
  }
  modelId(attributes) {
    return attributes[this.model.prototype.mainkey];
  }
  slice() {
    return Array.prototype.slice.apply(this.models, arguments);
  }
  pluck(attr) {
    return _.invoke(this.models, 'get', attr);
  }
  has(obj) {
    return this.get(obj) != null;
  }
  // data operator
  reset(models, options) {
    options = options ? _.clone(options) : {};
    for(let i = 0; i < this.models.length; i++) {
      let model = this.models[i];
      this._removeReference(model);
    }
    this._reset();
    models = this.add(models, _.extend({silent: true}, options));
    if(!options.silent) this.emit('reset', this, options);
    return this;
  }
  add(models, options) {
    const args = resolveParameters.apply(this, arguments);
    models = args.shift();
    options = args.shift();
    
    let toAdd = [];
    let at = options.at != null ? +options.at : void 0;
    if(at < 0) at += this.length + 1;

    let i = 0, model;
    for(;i < models.length; i++) {
      model = models[i];
      let exsiting = this.get(model);
      if(!exsiting) {
        model = this._prepareModel(model, options);
        if (model) {
          toAdd.push(model);
          this._addReference(model, options);
        }
      }else {
        continue;
      }
    }

    if(toAdd.length > 0) {
      splice(this.models, toAdd, at == null ? this.length : at);
      this.length = this.models.length;
    }

    if(!options.silent) {
      for(let i = 0; i < toAdd.length; i++) {
        if (at != null) options.index = at + i;
        model = toAdd[i];
        model.emit('add', model, this, options);
      }
    }
    
    return this;
  }
  set(models, options) {
    const args = resolveParameters.apply(this, arguments);
    models = args.shift();
    options = args.shift();

    let i = 0, model, toUpdate = [];
    for(;i < models.length; i++) {
      model = models[i];
      let exsiting = this.get(model);
      if(exsiting && model !== exsiting) {
        delete model.mid;
        let attrs = Model.isModel(model) ? model.attributes : model;
        exsiting.set(attrs, options);
        toUpdate.push(exsiting);
      }else {
        continue;
      }
    }
    return this;
  }
  remove(models, options) {
    const args = resolveParameters.apply(this, arguments);
    models = args.shift();
    options = args.shift();
    return this._removeModels(models, options);
  }
  get(obj) {
    if(obj == null) return void 0;
    return this._ref[obj]
      || this._ref[this.modelId(obj.attributes || obj)]
      || (obj.mid && this._ref[obj.mid]);
  }
  
  at(index) {
    if(index < 0) index += this.length;
    return this.models[index];
  }
  where(attrs, first) {
    let matcher = _.matcher(attrs);
    return this[first ? 'find' : 'filter'](
      (model) => matcher(model.attributes)
    )
  }
  // sync
  sync() {
    return sync.apply(this, arguments);
  }
  fetch(options) {
    options = _.extend({parse: true}, options)
    const resolve = (res) => {
      if(res != null) this.reset(res, options);
      this.emit('sync', this, res, options);
    }
    return this.sync('read', this, resolve, options);
  }
  create(model, options) {
    options = options ? _.clone(options) : {};
    model = this._prepareModel(model, options);
    if(!model) return false;
    if(!options.delay) this.add(model, options);
    const resolve = res => {
      if(options.delay) this.add(res, options);
    }
    model.save(null, options);
    return model;
  }
  // rewrite
  initialize() {}
  parse(resp) {return resp}
}

// 扩展underscore原型方法
const collectionMethodMap = ['filter', 'find', 'indexOf', 'last', 'first', 'each', 'map', 'chain'];
const modelsMethodMap = ['groupBy', 'countBy', 'sortBy', 'indexBy'];
_.each(collectionMethodMap, function(method) {
  if (!_[method]) return;
  Collection.prototype[method] = function() {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(this.models);
    return _[method].apply(_, args);
  };
});
_.each(modelsMethodMap, function(method) {
  if (!_[method]) return;
  Collection.prototype[method] = function(value, context) {
    var iterator = _.isFunction(value) ? value : function(model) {
      return model.get(value);
    };
    return _[method](this.models, iterator, context);
  };
});

Collection.splice = splice;

module.exports = Collection;