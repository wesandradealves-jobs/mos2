Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

const _reactBootstrap = require('react-bootstrap');

const _tab = _interopRequireDefault(require('../tab'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    const descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) {
      descriptor.writable = true;
    }
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) {
    _defineProperties(Constructor.prototype, protoProps);
  }
  if (staticProps) {
    _defineProperties(Constructor, staticProps);
  }
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) {
    _setPrototypeOf(subClass, superClass);
  }
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

const TabsList =
  /* #__PURE__ */
  (function(_React$Component) {
    _inherits(TabsList, _React$Component);

    function TabsList(props) {
      let _this;

      _classCallCheck(this, TabsList);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(TabsList).call(this, props)
      );
      _this.state = {
        selectedOption: 'new-occurrence',
      };
      _this.handleChange = _this.handleChange.bind(
        _assertThisInitialized(_this)
      );
      return _this;
    }

    _createClass(TabsList, [
      {
        key: 'handleChange',
        value: function handleChange(event) {
          this.setState({
            selectedOption: event.target.value,
          });
        },
      },
      {
        key: 'render',
        value: function render() {
          const _this2 = this;

          return _react.default.createElement(
            _reactBootstrap.Row,
            null,
            _react.default.createElement(
              _reactBootstrap.Col,
              null,
              _react.default.createElement(
                'ul',
                null,
                this.props.data.map(function(item) {
                  return _react.default.createElement(_tab.default, {
                    className: 'icon',
                    title: item.title,
                    icon: item.icon,
                    value: item.value,
                    key: item.title,
                    onChangeValue: _this2.handleChange,
                    selectedOption: _this2.state.selectedOption,
                  });
                })
              )
            )
          );
        },
      },
    ]);

    return TabsList;
  })(_react.default.Component);

const _default = TabsList;
exports.default = _default;

// # sourceMappingURL=TabsList.js.map
