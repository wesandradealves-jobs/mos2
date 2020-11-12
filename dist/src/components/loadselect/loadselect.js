'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireWildcard(require('react'));

const _select = _interopRequireDefault(require('./select'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== 'function') {
return null;
} const cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
}; return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
} if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') {
    return { default: obj };
} const cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) {
    return cache.get(obj);
} const newObj = {}; const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
} else {
        newObj[key] = obj[key];
}
}
} newObj.default = obj; if (cache) {
    cache.set(obj, newObj);
} return newObj;
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
};
} else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
};
} return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg); var {value} = info;
} catch (error) {
    reject(error); return;
} if (info.done) {
    resolve(value);
} else {
    Promise.resolve(value).then(_next, _throw);
}
}

function _asyncToGenerator(fn) {
  return function() {
    let self = this; let args = arguments; return new Promise(function(resolve, reject) {
      let gen = fn.apply(self, args); function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
} function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
} _next(undefined);
});
};
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
}
}

function _defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) {
descriptor.writable = true;
} Object.defineProperty(target, descriptor.key, descriptor);
}
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) {
_defineProperties(Constructor.prototype, protoProps);
} if (staticProps) {
_defineProperties(Constructor, staticProps);
} return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
} return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
}; return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
} return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
} subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) {
_setPrototypeOf(subClass, superClass);
}
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p; return o;
}; return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
} else {
    obj[key] = value;
} return obj;
}

const AsyncSelectContainer =
  /* #__PURE__*/
  (function(_Component) {
    _inherits(AsyncSelectContainer, _Component);

    function AsyncSelectContainer(props) {
      let _this;

      _classCallCheck(this, AsyncSelectContainer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncSelectContainer).call(this, props));

      _defineProperty(
          _assertThisInitialized(_this),
          'loadOptions',
          /* #__PURE__*/
          _asyncToGenerator(
              /* #__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                var b; let a;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        b = [{
                          value: 'vanilla',
                          label: 'Vanilla',
                          rating: 'safe',
                        },
                      {
                          value: 'chocolate',
                          label: 'Chocolate',
                          rating: 'good',
                        },
                      {
                          value: 'strawberry',
                          label: 'Strawberry',
                          rating: 'wild',
                        },
                      {
                          value: 'salted-caramel',
                          label: 'Salted Caramel',
                          rating: 'crazy',
                        },
                        console.log('Log', process.env.REACT_APP_SAC_API + _this.props.selectUrl, _this.props.selectUrl); // return b

                    _context.next = 4;
                        return fetch(process.env.REACT_APP_SAC_API + _this.props.selectUrl);

                      case 4:
                        a = _context.sent;
                        console.log('data', a);
                    return _context.abrupt('return', a);

                      case 7:
                  case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

      _this.state = {
        data: [],
      };
      return _this;
    }

    _createClass(AsyncSelectContainer, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          const a = this.setState(this.state.data, this.loadOptions);
        },
      },
      {
        key: 'render',
        value: function render() {
          return _react.default.createElement(_select.default, {
            selectName: 'motivo',
            data: this.state.data,
          });
        },
      },
    ]);

    return AsyncSelectContainer;
  })(_react.Component);

exports.default = AsyncSelectContainer;

// # sourceMappingURL=loadselect.js.map
