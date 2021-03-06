'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var agrouter = require('agrouter');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Link = function (_React$Component) {
  inherits(Link, _React$Component);

  function Link() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (e) {
      e.preventDefault();
      _this.context.navigateTo(_this.props.to);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Link, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          children = _props.children,
          to = _props.to,
          restProps = objectWithoutProperties(_props, ["children", "to"]);

      return React.createElement(
        "a",
        _extends({ href: to, onClick: this.onClick }, restProps),
        children
      );
    }
  }]);
  return Link;
}(React.Component);

Link.contextTypes = {
  navigateTo: PropTypes.function
};

Link.propTypes = {
  children: PropTypes.array,
  to: PropTypes.string.isRequired
};

var RouteView = function (_React$Component) {
  inherits(RouteView, _React$Component);

  function RouteView() {
    classCallCheck(this, RouteView);
    return possibleConstructorReturn(this, (RouteView.__proto__ || Object.getPrototypeOf(RouteView)).apply(this, arguments));
  }

  createClass(RouteView, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        routeIndex: this.context.routeIndex + 1
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.context.subscribe(this, function () {
        _this2.setState({
          id: Date.now()
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.unsubscribe(this);
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var _context = this.context,
          getRouteContent = _context.getRouteContent,
          routeIndex = _context.routeIndex;

      var component = getRouteContent(routeIndex);

      return component ? component : React.createElement(
        "div",
        null,
        children
      );
    }
  }]);
  return RouteView;
}(React.Component);

RouteView.contextTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  getRouteContent: PropTypes.func.isRequired,
  routeIndex: PropTypes.number
};

RouteView.propTypes = {
  children: PropTypes.array,
  isLoading: PropTypes.bool
};

var defaultRouteComponents = [];

var Router = function (_React$Component) {
  inherits(Router, _React$Component);

  function Router() {
    var _ref;

    classCallCheck(this, Router);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = possibleConstructorReturn(this, (_ref = Router.__proto__ || Object.getPrototypeOf(Router)).call.apply(_ref, [this].concat(args)));

    _this.getRouteContent = function (routeIndex) {
      return (_this.state.routeComponents || defaultRouteComponents)[routeIndex];
    };

    _this.subscribe = function (reference, callback) {
      _this.routeViewSubscribers.set(reference, callback);
    };

    _this.unsubscribe = function (reference) {
      _this.routeViewSubscribers.delete(reference);
    };

    _this.navigateTo = function (pathname) {
      var pushState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var deferedLoading = setTimeout(function () {
        return _this.setState({ isLoading: true });
      });

      _this.router.navigate(pathname, pushState) // eslint-disable-line promise/catch-or-return
      .then(function (_ref2) {
        var _ref2$uriSegments = _ref2.uriSegments,
            uriSegments = _ref2$uriSegments === undefined ? [] : _ref2$uriSegments;
        // eslint-disable-line promise/always-return
        clearTimeout(deferedLoading);

        var routeComponents = uriSegments.filter(function (_ref3) {
          var actionResult = _ref3.actionResult;
          return React.isValidElement(actionResult);
        }).map(function (_ref4) {
          var actionResult = _ref4.actionResult;
          return actionResult;
        });

        _this.setState({
          isLoading: false,
          uriSegments: uriSegments,
          routeComponents: routeComponents
        }, function () {
          return _this.routeViewSubscribers.forEach(function (subscriber) {
            return subscriber();
          });
        });
      });
    };

    _this.onLocationChange = function () /* { state } */{
      _this.navigateTo(document.location.pathname, false);
    };

    _this.routeViewSubscribers = new Map();
    return _this;
  }

  createClass(Router, [{
    key: "getChildContext",
    value: function getChildContext() {
      var getRouteContent = this.getRouteContent,
          navigateTo = this.navigateTo,
          subscribe = this.subscribe,
          unsubscribe = this.unsubscribe;

      return {
        getRouteContent: getRouteContent,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        navigateTo: navigateTo,
        routeIndex: 0
      };
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.router = agrouter.createRouter(this.props.routes, {
        history: window.history // TODO: Use agnostic history so we can do SSR
      });

      window.addEventListener("popstate", this.onLocationChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("popstate", this.onLocationChange);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.navigateTo(document.location.pathname, false);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(RouteView, { isLoading: this.state.isLoading });
    }
  }]);
  return Router;
}(React.Component);

Router.childContextTypes = {
  getRouteContent: PropTypes.func,
  unsubscribe: PropTypes.func,
  subscribe: PropTypes.func,
  navigateTo: PropTypes.func,
  routeIndex: PropTypes.number
};

Router.propTypes = {
  routes: PropTypes.object.isRequired
};

exports.ROUTE_PRESETS = agrouter.ROUTE_PRESETS;
exports.Link = Link;
exports.Router = Router;
exports.RouteView = RouteView;
