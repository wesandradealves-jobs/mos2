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

var instances = 0;

var DropdownMenu = function (_React$Component) {
  _inherits(DropdownMenu, _React$Component);

  function DropdownMenu() {
    _classCallCheck(this, DropdownMenu);

    var _this = _possibleConstructorReturn(this, (DropdownMenu.__proto__ || Object.getPrototypeOf(DropdownMenu)).call(this));

    _this.toggleMenu = _this.toggleMenu.bind(_this);
    instances += 1;

    _this.MENUITEMS_DIV = '__react_bs_dd_menuItems_' + instances;
    _this.CARAT_CLASS = '__react_bs_dd_carat_' + instances;
    _this.TRIGGER_CLASS = '__react_bs_dd_trigger_' + instances;
    return _this;
  }

  _createClass(DropdownMenu, [{
    key: 'toggleMenu',
    value: function toggleMenu(e) {
      var items = document.getElementById(this.MENUITEMS_DIV);

      if (items) {
        items.classList.toggle("show");
        if (this.props.fadeIn && this.props.fadeIn == "true") {
          this.fadeIn(document.getElementById(this.MENUITEMS_DIV));
        }
        this.toggleArrow(e);
      }
    }
  }, {
    key: 'toggleArrow',
    value: function toggleArrow(e) {
      var carat = document.getElementById(this.CARAT_CLASS);
      var image = document.getElementById(this.TRIGGER_CLASS);


      if (carat) {
        if (carat.className === "glyphicon glyphicon-triangle-top") {
          carat.className = "glyphicon glyphicon-triangle-bottom";
        } else {
          carat.className = "glyphicon glyphicon-triangle-top";
        }
      }

      if (typeof image != 'undefined') {
        if (image.src.includes(this.props.triggerUp)) {
          image.src = this.props.trigger;
        } else {
          image.src = this.props.triggerUp;
        }
      }
    }
  }, {
    key: 'fadeIn',
    value: function fadeIn(element) {
      element.style.opacity = 0;

      var tick = function tick() {
        element.style.opacity = +element.style.opacity + 0.04;

        if (+element.style.opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
        }
      };

      tick();
    }
  }, {
    key: 'showLoggedInUserName',
    value: function showLoggedInUserName() {
      if (this.props.userName) {
        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'p',
            null,
            'Logged in as: ',
            _react2.default.createElement('br', null),
            _react2.default.createElement(
              'strong',
              null,
              this.props.userName
            )
          ),
          _react2.default.createElement('hr', { style: _Css2.default.separator })
        );
      }
    }
  }, {
    key: 'getTrigger',
    value: function getTrigger() {

      if (this.props.triggerType && this.props.trigger) {

        switch (this.props.triggerType.toLowerCase()) {
          case "image":
            var triggerStyle = _Css2.default.imageTrigger;
            var caratStyle = _Css2.default.triangle;

            if (this.props.triggerWidth) {
              triggerStyle.width = this.props.triggerWidth;
            }
            if (this.props.triggerHeight) {
              triggerStyle.height = this.props.triggerHeight;
            }
            if (this.props.caratColor) {
              caratStyle.color = this.props.caratColor;
            }

            return _react2.default.createElement(
              'div',
              { style: {display: 'flex', alignItems: 'center', justifyContent: 'center'}, onClick: this.toggleMenu },
              _react2.default.createElement('img', { src: this.props.trigger, style: triggerStyle, className: this.TRIGGER_CLASS,  id: this.TRIGGER_CLASS}),
              // _react2.default.createElement('span', { id: this.CARAT_CLASS, className: 'glyphicon glyphicon-triangle-bottom', style: caratStyle })
            );
          case "text":
            return _react2.default.createElement(
              'div',
              { className: this.TRIGGER_CLASS, onClick: this.toggleMenu, style: _Css2.default.textTrigger },
              this.props.trigger,
              '\xA0\xA0',
              _react2.default.createElement('span', { id: this.CARAT_CLASS, className: 'glyphicon glyphicon-triangle-bottom', style: caratStyle })
            );
          case "icon":
            return _react2.default.createElement('span', { className: this.props.trigger, style: _Css2.default.gear, onClick: this.toggleMenu });
          default:
            throw "The value for DropdownMenu 'triggerType' is not supported for DropdownMenu. Try 'image', 'text' or 'icon'.";
        }
      } else {
        return _react2.default.createElement('span', { className: 'glyphicon glyphicon-cog', style: _Css2.default.gear, onClick: this.toggleMenu });
      }
    }
  }, {
    key: 'getMenuStyle',
    value: function getMenuStyle() {
      var menuStyle = JSON.parse(JSON.stringify(_Css2.default.menuContent)); // Clone the current style
      var position = this.props.position === undefined ? 'right' : this.props.position;
      var supportedPositions = ['left', 'center', 'right'];

      if (supportedPositions.indexOf(position.toLowerCase()) === -1) {
        throw "The value for 'position' prop is not supported for DropdownMenu. Try 'left', 'center' or 'right'.";
      }

      if (position) {
        var baseWidth = parseInt(_Css2.default.menuContent.minWidth.replace('px', ''));
        var offset = 0;
        baseWidth = baseWidth - 40;

        // We need to use negative numbers as we are offsetting menu to the left
        if (position === "center") {
          offset = baseWidth / 2 * -1;
        }
        if (position === "left") {
          offset = baseWidth * -1;
        }

        menuStyle.left = offset.toString() + 'px';
      }

      return menuStyle;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var TRIGGER_CLASS = this.TRIGGER_CLASS;
      var MENUITEMS_DIV = this.MENUITEMS_DIV;
      var CARAT_CLASS = this.CARAT_CLASS;

      window.addEventListener("click", function (e) {
        var klass = e.target.className;
        var carat = document.getElementById(CARAT_CLASS);

        if(typeof klass != "string") return;

        if (klass !== MENUITEMS_DIV + " show" && klass !== TRIGGER_CLASS && !klass.lastIndexOf("glyphicon", 0) == 0) {
          var menuItemDiv = document.getElementById(MENUITEMS_DIV);

          if (menuItemDiv) {
            menuItemDiv.classList.remove('show');

            if (carat) {
              carat.className = "glyphicon glyphicon-triangle-bottom";
            }
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.children.length === 0) {
        throw "DropdownMenu must have at least one MenuItem child.";
      }

      return _react2.default.createElement(
        'div',
        { style: _Css2.default.menu },
        this.getTrigger(),
        _react2.default.createElement(
          'div',
          { id: this.MENUITEMS_DIV, className: this.MENUITEMS_DIV, style: this.getMenuStyle() },
          this.showLoggedInUserName(),
          this.props.children
        )
      );
    }
  }]);

  return DropdownMenu;
}(_react2.default.Component);

;

exports.default = DropdownMenu;