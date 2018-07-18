# 后台管理平台UI库及JavaScript-MVC框架

## 后台管理平台UI
适用于中小型管理平台UI界面。扁平化风格，基于H-ui。

## JavaScript-MVC框架

类似于Backbone的MVC框架，分离视图层、数据层、控制层。

### 视图层 UI.View
基于nunjucks模板预编译，监听数据层变化更新DOM。

### 数据层 UI.Model, UI.Collection
提供应用数据本地ORM映射，包括数据持久化，采用RSETful API风格，实现数据的CRUD。

> 未来将会支持 表间关系引用。

### 控制层 UI.Controller
负责绑定DOM事件，处理数据更新，也可手动处理视图更新。

# 代码解析
基于javascript的原型特性，为了之后准确的描述属性，在此定义如下：1
1. 方法也是属性，如不特殊说明方法，则都指代属性`值或引用`
2. 构造器本质是个函数，函数也是一种对象

| 名称 | 静态属性/方法 | 实例属性/方法 | 原型属性/方法 |
|-----|:------------|:------------|:------------|
|调用|直接通过构造器调用|构造器实例化之后的实例调用|1.构造器通过Conc.prototype.method.apply(this, arguments) 2.实例直接调用|
|定义|在构造器上直接定义Conc.method = ...|在构造器函数体之内定义|在构造器的prototype对象上定义|

## Events
> Events是一个事件构造器，与node原生的EventEmitter类似，可以是实现多种事件绑定、卸载的方式。并且提供了对象与对象之间的绑定监听，它是MVC的基础，
1. 原型方法
- on(name, callback, context) 绑定事件
   - @param name 事件名称 用空格隔开表示绑定多个事件

## UI
> UI是一个根对象，它上面挂载了MVC框架需要使用的构造器和普通对象。同时它也可以作为全局EventBus使用，它继承自自定义Events对象