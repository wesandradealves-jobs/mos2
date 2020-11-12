'use strict';

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
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ?
        'symbol' :
        typeof obj;
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
  _getPrototypeOf = Object.setPrototypeOf ?
    Object.getPrototypeOf :
    function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
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

const FileSelector =
  /* #__PURE__*/
  (function(_React$Component) {
    _inherits(FileSelector, _React$Component);

    function FileSelector(props) {
      let _this;

      _classCallCheck(this, FileSelector);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FileSelector).call(this, props));
      _this.uniqueId = 'selector-'.concat(_this.props.name);
      _this.state = {
        file: false,
      };
      _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
      _this.handleAdd = _this.handleAdd.bind(_assertThisInitialized(_this));
      _this.clear = _this.clear.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(FileSelector, [
      {
        key: 'handleChange',
        value: function handleChange(event) {
          const file = event.target.files[0];
          this.setState({
            file: file,
          });
          this.props.onChange(file);
        },
      },
      {
        key: 'handleAdd',
        value: function handleAdd() {
          this.labelElement.click();
        },
      },
      {
        key: 'clear',
        value: function clear() {
          this.setState({
            file: null,
          });
          this.props.onChange(null);
        },
      },
      {
        key: 'render',
        value: function render() {
          const _this2 = this;

          let content;
          let button;

          if (!this.state.file) {
            content = _react.default.createElement(
                'span',
                {
                  className: 'attachment-placeholder',
                },
                'Selecionar arquivo'
            );
            button = _react.default.createElement(
                'div',
                {
                  className: 'add-button',
                },
                _react.default.createElement('img', {
                  src: '/icons/function-icons/add.svg',
                  alt: '+',
                  onClick: this.handleAdd,
                })
            );
          } else {
            content = _react.default.createElement(
                'span',
                {
                  className: 'filename',
                },
                this.state.file.name
            );
            button = _react.default.createElement(
                'span',
                {
                  className: 'button remove',
                  onClick: this.clear,
                },
                'x'
            );
          }

          return _react.default.createElement(
              'div',
              {
                className: 'file-selector',
              },
              _react.default.createElement(
                  'label',
                  {
                    htmlFor: this.uniqueId,
                    ref: function ref(label) {
                      return (_this2.labelElement = label);
                    },
                  },
                  content
              ),
              button,
              _react.default.createElement('input', {
                id: this.uniqueId,
                type: 'file',
                onChange: this.handleChange,
              })
          );
        },
      },
    ]);

    return FileSelector;
  })(_react.default.Component);

const _default = FileSelector;
exports.default = _default;

// # sourceMappingURL=fileSelector.js.map
