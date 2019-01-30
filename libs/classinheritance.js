// Input 0
/*
 Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */
(function() {
  var initializing = false, fnTest = /qwerty/.test(function() {
    qwerty
  }) ? /\b_super\b/ : /.*/;
  window["Class"] = function() {
  };
  Class.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this;
    initializing = false;
    function makeWrapperFunctionToEnableSuper(name, fn) {
      return function() {
        var tmp = this._super;
        this._super = _super[name];
        var ret = fn.apply(this, arguments);
        this._super = tmp;
        return ret
      }
    }
    for(var name in prop) {
      prototype[name] = typeof prop[name] == "function" && (typeof _super[name] == "function" && fnTest.test(prop[name])) ? makeWrapperFunctionToEnableSuper(name, prop[name]) : prop[name]
    }
    function Class() {
      if(!initializing && this.init) {
        this.init.apply(this, arguments)
      }
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class
  }
})();

