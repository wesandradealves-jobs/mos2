/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Css = require('./Css');

var _Css2 = _interopRequireDefault(_Css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItem = function (_React$Component) {
  _inherits(MenuItem, _React$Component);

  function MenuItem() {
    _classCallCheck(this, MenuItem);

    var _this = _possibleConstructorReturn(this, (MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).call(this));

    _this.state = {
      linkStyle: _Css2.default.pointer
    };
    return _this;
  }

  _createClass(MenuItem, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.linkStyle) {
        this.setState({ linkStyle: this.props.linkStyle });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.type) {
        if (this.props.type.toLowerCase() === 'separator') {
          return _react2.default.createElement('hr', { style: _Css2.default.separator });
        } else {
          throw "The value for prop 'type' is not supported for MenuItem. The only supported type is 'separator'.";
        }
      } else {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { href: this.props.location, onClick: this.props.onClick,
              className: this.state.linkStyle, id: this.props.name },
            this.props.text
          ),
          _react2.default.createElement('br', null)
        );
      }
    }
  }]);

  return MenuItem;
}(_react2.default.Component);

;

exports.default = MenuItem;