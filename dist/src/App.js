'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

let _react = _interopRequireDefault(require('react'));

let _reactBootstrap = require('react-bootstrap');

let _sidemenu = _interopRequireDefault(require('./components/sidemenu'));

let _usermenu = _interopRequireDefault(require('./components/usermenu'));

let _sectiontitle = _interopRequireDefault(require('./components/sectiontitle'));

let _breadcrumbs = _interopRequireDefault(require('./components/breadcrumbs'));

let _tablist = _interopRequireDefault(require('./components/tablist'));

let _sac = _interopRequireDefault(require('./components/sac'));

function _interopRequireDefault(obj) {
 return obj && obj.__esModule ? obj : { default: obj };}

function _typeof(obj) {
 if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
 _typeof = function _typeof(obj) {
 return typeof obj;};} else {
 _typeof = function _typeof(obj) {
 return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;};} return _typeof(obj);}

function _classCallCheck(instance, Constructor) {
 if (!(instance instanceof Constructor)) {
 throw new TypeError('Cannot call a class as a function');}}

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

let App =
  /* #__PURE__*/
  (function(_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
      let _this;

      _classCallCheck(this, App);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
      _this.state = {};
      return _this;
    }

    _createClass(App, [
      {
        key: 'render',
        value: function render() {
      let tabsData = [{
              title: 'Novo Registro',
              icon: '/icons/tab-icons/add.svg',
              value: 'new-occurrence',
            },
            {
              title: 'Relatório',
              icon: '/icons/tab-icons/report.svg',
              value: 'report',
            },
            {
              title: 'Controle',
              icon: '/icons/tab-icons/control.svg',
              value: 'control',
            },
            {
              title: 'Editar Cliente',
              icon: '/icons/tab-icons/control.svg',
              value: 'customer',
            },
          ];
          return _react.default.createElement(
            _react.default.Fragment,
            null,
            _react.default.createElement(_sidemenu.default, null),
            _react.default.createElement(
              _reactBootstrap.Container,
              null,
              _react.default.createElement(_usermenu.default, {
                fullName: 'Joana Joaquina',
                department: 'Vendas',
              }),
              _react.default.createElement(_sectiontitle.default, {
                title: 'SAC',
              }),
              _react.default.createElement(_breadcrumbs.default, {
                sections: ['Home', 'SAC'],
              }),
              _react.default.createElement(_tablist.default, {
                data: tabsData,
              }),
              _react.default.createElement(_sac.default, null)
            )
          );
        },
      },
    ]);

    return App;
  })(_react.default.Component);

let _default = App;
exports.default = _default;

// # sourceMappingURL=App.js.map
