Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const Tab =
  /* #__PURE__ */
  (function(_React$Component) {
    _inherits(Tab, _React$Component);

    function Tab(props) {
      let _this;

      _classCallCheck(this, Tab);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(Tab).call(this, props)
      );

      _defineProperty(_assertThisInitialized(_this), '', void 0);

      _this.state = {};
      return _this;
    }

    _createClass(Tab, [
      {
        key: 'render',
        value: function render() {
          return _react.default.createElement(
            'li',
            {
              className: 'nav-tab',
            },
            _react.default.createElement('input', {
              type: 'radio',
              name: 'tabs',
              className: 'tabs',
              id: 'tab'.concat(this.props.value),
              value: this.props.value,
              checked: this.props.selectedOption === this.props.value,
              onChange: this.props.onChangeValue,
            }),
            _react.default.createElement(
              'label',
              {
                htmlFor: 'tab'.concat(this.props.value),
                className: 'label -first',
              },
              _react.default.createElement('img', {
                alt: 'icon',
                src: this.props.icon,
                className: 'icon',
              }),
              this.props.title
            )
          );
        },
      },
    ]);

    return Tab;
  })(_react.default.Component);

const _default = Tab;
exports.default = _default;

// # sourceMappingURL=Tab.js.map
