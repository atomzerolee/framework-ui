const _ = require('underscore');
const Events = require('./events');
const Model = require('./model');
const Collection = require('./collection');
const View = require('./view');
const Controller = require('./controller');
const sync = require('./sync');

class UI extends Events {
  constructor() {
    super();
    this.Model = Model;
    this.Collection = Collection;
    this.View = View;
    this.Controller = Controller;
    this.sync = sync;
    this.Model.extend = this.Collection.extend = this.View.extend = this.Controller.extend = this.extends;
  }
  extends(protoProps, staticProps) {
    const parent = this;
    let child;
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }
    _.extend(child, parent, staticProps);
    child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  }
}

module.exports = new UI;

if(window) window.UI = module.exports;