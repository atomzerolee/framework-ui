const $ = require('jquery');
const Events = require('./events');
const View = require('./view');

// {'click .selector': 'method'}
const delegateEventSplitter = /^(\S+)\s*(.*)$/;

class Controller extends Events {
  constructor() {
    super();
    this.initialize.apply(this, arguments); // 挂载view model
    if(View.isView(this.view) && !this._unbind) { // _unbind 不自动绑定
      this.delegateEvents();
    }
  }
  delegateEvents(events) {
    events || (events = _.result(this, 'events'));
    if(!events) return this;
    this.undelegateEvents();
    for(let key in events) {
      let method = events[key];
      if (!_.isFunction(method)) method = this[method];
      if (!method) continue;
      let match = key.match(delegateEventSplitter);
      this.delegate(match[1], match[2], _.bind(method, this));
    }
  }
  delegate(eventName, selector, listener, data) {
    data = _.clone(data) || data;
    this.view.$el.on(eventName + '.delegateEvents' + this.view.vid, selector, data, listener);
    return this;
  }
  undelegateEvents() {
    if(this.view.$el) this.view.$el.off('.delegateEvents' + this.view.cid);
    return this;
  }
  undelegate(eventName, selector, listener) {
    this.view.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
    return this;
  }
  destroy() {
    this.undelegateEvents();
    this.stopListening();
    this.view = null;
  }
  // 构造函数
  initialize() {}
}

module.exports = Controller;