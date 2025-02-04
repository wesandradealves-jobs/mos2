'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

let _react = _interopRequireWildcard(require('react'));

function _getRequireWildcardCache() {
 if (typeof WeakMap !== 'function') {return null;} let cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() {
 return cache;}; return cache;}

function _interopRequireWildcard(obj) {
 if (obj && obj.__esModule) {
 return obj;} if (obj === null || _typeof(obj) !== 'object' && typeof obj !== 'function') {
 return { default: obj };} let cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) {
 return cache.get(obj);} let newObj = {}; let hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (let key in obj) {
 if (Object.prototype.hasOwnProperty.call(obj, key)) {
 let desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) {
 Object.defineProperty(newObj, key, desc);} else {
 newObj[key] = obj[key];}}} newObj.default = obj; if (cache) {
 cache.set(obj, newObj);} return newObj;}

function _typeof(obj) {
 if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
 _typeof = function _typeof(obj) {
 return typeof obj;};} else {
 _typeof = function _typeof(obj) {
 return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;};} return _typeof(obj);}

function _classCallCheck(instance, Constructor) {
 if (!(instance instanceof Constructor)) {
 throw new TypeError('Cannot call a class as a function');}}
}

function _defineProperties(target, props) {
 for (let i = 0; i < props.length; i++) {
 let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) {descriptor.writable = true;} Object.defineProperty(target, descriptor.key, descriptor);}}
}

function _createClass(Constructor, protoProps, staticProps) {
 if (protoProps) {_defineProperties(Constructor.prototype, protoProps);} if (staticProps) {_defineProperties(Constructor, staticProps);} return Constructor;}

function _possibleConstructorReturn(self, call) {
 if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
 return call;} return _assertThisInitialized(self);}

function _assertThisInitialized(self) {
 if (self === void 0) {
 throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');} return self;}

function _getPrototypeOf(o) {
 _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
 return o.__proto__ || Object.getPrototypeOf(o);}; return _getPrototypeOf(o);}

function _inherits(subClass, superClass) {
 if (typeof superClass !== 'function' && superClass !== null) {
 throw new TypeError('Super expression must either be null or a function');} subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) {_setPrototypeOf(subClass, superClass);} 
}

function _setPrototypeOf(o, p) {
 _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
 o.__proto__ = p; return o;}; return _setPrototypeOf(o, p);}

let Select =
  /* #__PURE__*/
  (function(_Component) {
    _inherits(Select, _Component);

    function Select() {
      _classCallCheck(this, Select);

      return _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this));
    }

    _createClass(Select, [
      {
        key: 'render',
        value: function render() {
      let optionItems = this.props.data.map(function(option) {
            return _react.default.createElement(
              'option',
              {
                key: option.value,
              },
              option.label
            );
          });
          let name = this.props.selectName;
          console.log(this.props.selectUrl);
          return _react.default.createElement('div', null, _react.default.createElement('select', null, optionItems));
        },
      },
    ]);

    return Select;
  })(_react.Component);

exports.default = Select;

// # sourceMappingURL=select.js.map
