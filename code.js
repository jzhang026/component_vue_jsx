function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value"in descriptor)
          descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
      _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Parent = 
function() {
    function Parent(config) {
        _classCallCheck(this, Parent);

        console.log("config", config);
        this.children = [];
    }

    _createClass(Parent, [{
        key: "setAttribute",
        value: function setAttribute(name, value) {
            console.log(name, value);
        }
    }, {
        key: "appendChild",
        value: function appendChild(child) {
            console.log("parent::apendChild", child);
        }
    }, {
        key: "class",
        set: function set(v) {
            console.log('Parent::class', v);
        }
    }]);

    return Parent;
}();