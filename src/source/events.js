const _ = require('underscore');

const eventSplitter = /\s+/;

// 处理eventMap 'event event'
const eventsFactory = (obj, action, name, rest) => {
  if(!name) return true;
  if(typeof name === 'object') {
    for(let key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest));
    }
    return false;
  }
  if(eventSplitter.test(name)) {
    let names = name.split(eventSplitter);
    for(let i = 0, len = names.length; i < len; i++) {
      obj[action].apply(obj, [names[i]].concat(rest))
    }
    return false;
  }
  return true;
}

// 存在this指向时，call的性能明显优于apply
const emitEvents = (events, args) => {
  let ev, i = -1, len = events.length;
  switch(args.length) {
    case 0: while(++i < len)(ev = events[i]).callback.call(ev.ctx);return;
    case 1: while(++i < len)(ev = events[i]).callback.call(ev.ctx, args[0]);return;
    case 2: while(++i < len)(ev = events[i]).callback.call(ev.ctx, args[0], args[1]);return;
    case 3: while(++i < len)(ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);return;
    default: while(++i < len)(ev = events[i]).callback.apply(ev.ctx, args);return;
  }
}

class Events {
  on(name, callback, context) {
    if(!eventsFactory(this, 'on', name, [callback, context]) || !callback)
      return this;
    if(!this._events) this._events = {};
    let events = this._events[name] || (this._events[name] = []);
    events.push({callback: callback, context: context, ctx: context || this});
    return this;
  }
  once(name, callback, context) {
    if(!eventsFactory(this, 'once', name, [callback, context]) || !callback)
      return this;
    let self = this;
    let once = _.once(function() {
      self.off(name, once); // 停止监听
      callback.apply(this, arguments);
    });
    once._callback = callback;
    return this.on(name, once, context);
  }
  off(name, callback, context) {
    if(!this._events || !eventsFactory(this, 'off', name, [callback, context])) {
      return this;
    }
    // 清空所有事件
    if(!name && !callback && !context) {
      this._events = void 0;
      return this;
    }

    let names = name ? [name] : _.keys(this.events);
    for(let i = 0, len = names.length; i < len; i++) {
      name = names[i];
      let events = this._events[name];
      if(!events) continue;

      if(!callback && !context) {
        // 清除该事件所有回调
        delete this._events[name];
        continue
      }

      let remaining = [];
      for(let j = 0, elength = events.length; j < elength; j++) {
        let event = events[i];
        // callback或context与event定义时不匹配，则不删除event
        if(callback && callback !== event.callback
          && callback !== event.callback._callback // 处理 once
          || context && context !== event.context
        ) {
          remaining.push(event);
        }
      }
      //重新赋值 _event.name 数组。不使用splice()方法
      if(remaining.length) {
        this._events[name] = remaining;
      }else {
        delete this._events[name];
      }
    }
    return this;
  }
  emit(name) {
    if(!this._events) {
      return this;
    }
    let args = [].slice.call(arguments, 1);
    if(!eventsFactory(this, 'emit', name, args)) {
      return this;
    }
    let events = this._events[name];
    let allEvents = this._events.all;
    if(events) {
      emitEvents(events, args);
    }
    if(allEvents) {
      emitEvents(allEvents, arguments);
    }
    return this;
  }
  // 当前对象监听obj对象的事件, obj对象存在一个_listenId, 当前对象存在一个对_listeningTo 保持对obj对象的引用
  listenTo(obj, name, callback) {
    let listeningTo = this._listeningTo || (this._listeningTo = {});
    if(!obj._listenId) {
      obj._listenId = _.uniqueId('l')
    }
    let id = obj._listenId;
    listeningTo[id] = obj;
    // 当name为对象，callback为undefined 则为 obj.on的第二个参数 context
    if(!callback && typeof name === 'object') callback = this;
    // name为对象则将callback指定为this，否则为真实callback回调
    // 不论name是否为对象，callback的 context 指向都为当前监听对象this，而不是被监听对象obj
    obj.on(name, callback, this);
    return this;
  }
  listenToOnce(obj, name, callback) {
    if(typeof name === 'object') {
      for(let event in name) {
        this.listeningToOnce(obj, event, event, name[event]);
      }
      return this;
    }
    if(eventSplitter.test(name)) {
      let names = name.split(eventSplitter);
      for(let i = 0, len = names.length; i < len; i++) {
        this.listenToOnce(obj, names[i], callback);
      }
      return this;
    }
    if(!callback) return this;
    let self = this;
    let once = _.once(function() {
      self.stopListening(obj, name, once);
      callback.apply(this, arguments);
    });
    once._callback = callback;
    return this.listenTo(obj, name, once);
  }
  stopListening(obj, name, callback) {
    let listeningTo = this._listeningTo;
    if(!listeningTo) return this;
    let remove = !name && !callback;
    if(!callback && typeof name === 'object') callback = this;
    if(obj) {
      listeningTo = {};
      listeningTo[obj._listenId] = obj;
    }
    for(let id in listeningTo) {
      obj = listeningTo[id];
      if(!name && !callback) {
        obj.off();
      }else {
        obj.off(name, callback, this);
      }
      if(remove || _.isEmpty(obj._events)) 
        delete this._listeningTo[id];
    }
    return this;
  }
}

Events.prototype.bind = Events.prototype.on;
Events.prototype.unbind = Events.prototype.off;

module.exports = Events;