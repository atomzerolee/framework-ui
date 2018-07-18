const nunjucks = require('nunjucks');
const Events = require('./events');
const $ = require('jquery');
const Model = require('./model');
const Collection = require('./collection');

// options支持函数
const viewOptions = ['template', 'model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName']
const viewSpliter = /^.*\.(njk)$/

// addFilter未验证
class View extends Events {
  constructor(options) {
    super();
    options || (options = _.extend({}, options));
    this.vid = _.uniqueId('v');
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement(); //绑定el
    this.initialize.apply(this, arguments); // 初始化添加别的监听
    if(!options.unbind) { // 是否自动绑定
      this._bindEvents(); // 绑定对应model事件
    }
  }
  static isView(view) {
    return view instanceof View;
  }
  // Dom相关
  _createElement(tagName) {
    return document.createElement(tagName);
  }
  _ensureElement() {
    if(!this.el) {
      let attrs = _.extend({}, _.result(this, 'attributes'));
      if (this.id) attrs.id = _.result(this, 'id');
      if (this.className) attrs['class'] = _.result(this, 'className');
      this._setElement(this._createElement(_.result(this, 'tagName')));
      this._setAttributes(attrs);
    }else {
      this._setElement(_.result(this, 'el'));
    }
  }
  _setAttributes(attributes) {
    this.$el.attr(attributes);
  }
  _setElement(ele) {
    this.$el = ele instanceof $ ? ele : $(ele);
    this.el = this.$el[0];
  }
  _removeElement() {
    this.$el.remove();
  }
  $(selector) {
    return this.$el.find(selector);
  }
  remove() {
    this.stopListening();
    this._removeElement();
    return this;
  }
  // data数据层事件监听，触发渲染
  _bindEvents() {
    if(Model.isModel(this.model)) {
      this.listenTo(this.model, 'change', this.render);
    }
    if(Collection.isCollection(this.collection)) {
      this.listenTo(this.collection, 'change', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'add', this.render);
    }
  }
  // 模板相关 编译渲染为字符串 渲染为dom
  compile(data) {
    let model = this.model && this.model.toJSON()
    let collection = this.collection && this.collection.toJSON()
    data = _.clone(data) || model || collection;
    if(data == null || !viewSpliter.test(this.template)) return null;
    data = this.parse(data);
    return this.env.render(this.template, _.isArray(data) ? {data: data} : data);
  }
  render() {
    const _html = this.compile();
    if(_html != null) {
      this.$el.html(_html);
    }
    return this.$el;
  }
  // rewrite
  // 渲染过滤
  parse(resp) {
    return resp;
  }
  initialize() {}
}

View.prototype.env = new nunjucks.Environment();
View.prototype.tagName = 'div';

module.exports = View;