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