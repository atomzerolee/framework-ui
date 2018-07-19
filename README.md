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

1. 实例属性
   - events 绑定在实例上的一个属性 在这里存储了绑定的事件信息
2. 原型方法
	- on(name, callback, context) 绑定事件监听
	   - @param `name` **监听的事件** 支持三种格式
	      - 'click' 字符串 事件名称
	      - 'click keydown' 多个事件用**空格**隔开 绑定同一个处理函数
	      - {click: handleClick, keydown: handleKeydown} 事件map
	   - @param `callback` **事件回调函数**
	   - @param `context` **回调函数调用作用域**
	- once(name, callback, context) 绑定一次事件监听
	   - 参数与on相同，但是事件回调函数只触发一次
	- off(name, callback, context) 移除事件监听
	   - 参数与on相同，需注意callback必须一致才能移除监听，匿名函数注意
	- emit(name, ...arguments) 触发事件
	   - @param `name` 触发的事件名称 与on的参数name相同
	   - @param `arguments` 传递给监听回调函数的参数

上述的方法都是在当前A对象中监听A自己的事件，之后的方法是A监听B的事件，则意味着B的事件触发后，调用A的监听函数。
   - listenTo(obj, name, callback) 当前对象监听obj对象的事件
      - @param 参数与on类似 只是obj一定要obj一定也要为Events的实例
   - listenToOnce(obj, name, callback) 绑定一次事件监听
   - stopListening(obj, name, callback) 停止监听obj对象的事件
 
**Events作为框架的基石，基本UI之下的所有构造器都继承自Events。**

*注意：callback的this指向问题*

## UI
> UI是一个根对象，它上面挂载了MVC框架需要使用的构造器和普通对象。同时它也可以作为全局EventBus使用，它继承自Events对象

1. 基本方法

- extend(protoProps, staticProps) 返回一个继承自this的全新构造器，该构造器的原型属性，静态属性由参数决定。
   - @param protoProps 原型属性对象，类似于原来的construtor.prototype对象
   - @param staticProps 静态属性对象

```
 const User = UI.Model.extend(); // User是一个全新的构造器继承自UI.Model
 const tom = new User(); // tom 是一个User的实例
```

extend 是主要实现继承的方法，但是一般不会使用 UI.extend，而是通过UI.Model.extend，UI.Collection.extend 实现对数据层视图层的再扩展。

- sync(method, model, resolve, options) 数据同步函数
   - @param method 数据操作类型，create|update|delete|read|patch
   - @param model 发起请求的数据层Model或Collection
   - @param resolve 请求成功回调函数
   - @param options 配置项
      - url 数据请求API地址默认是通过Model或Collection指定的url解析确定的，如果配置该参数，则以该参数为请求地址
      - data 数据请求发送的参数会根据数据操作不同而改变，如果需要其他参数传递，则配置该项为对象，类似 jQuery 中 $.ajax 中的data参数
   - @return 返回一个jQuery xhr 对象，

sync是数据层持久化的重要方法，它还具有以下属性配置：

   - sync.host 请求地址的公共名 比如 'http://localhost:3010/api/v1'
   - sync.onError 请求错误的处理函数
   - sync.onData 请求响应的全局过滤函数，比如自定义code {code: 0, res: []}

上述三条属性通过在全局配置，例如

```
const UI = require('UI');
UI.sync.host = 'http://localhost:3010/api/v1';
UI.sync.onError = (xhr, textStatus, errorThrow) => {
  throw new Error(`UI.sync Capture an ajax's error: ${textStatus}`)
}
UI.sync.onData = (resp, xhr) => {
  if(typeof resp === 'string') resp = JSON.parse(resp);
    switch(resp.code) {
      case 0: return JSON.stringify(resp);
      case 99: {
        alert('操作错误')
        return null;
      }
      default: return null;
    }
}
```

UI.Model，UI.Collection内部的sync方法也是调用的UI.sync方法。

另外数据请求默认按照RSETful API风格