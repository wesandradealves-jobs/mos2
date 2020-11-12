'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

const _SidemenuIcons = _interopRequireDefault(require('./SidemenuIcons'));

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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ?
    Object.getPrototypeOf :
    function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
  return _getPrototypeOf(o);
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

const Sidemenu =
  /* #__PURE__*/
  (function(_React$Component) {
    _inherits(Sidemenu, _React$Component);

    function Sidemenu() {
      _classCallCheck(this, Sidemenu);

      return _possibleConstructorReturn(this, _getPrototypeOf(Sidemenu).apply(this, arguments));
    }

    _createClass(Sidemenu, [
      {
        key: 'getImage',
        value: function getImage(iconName, caption) {
          const icon = _SidemenuIcons.default[iconName];
          return _react.default.createElement('img', {
            src: icon,
            alt: caption,
          });
        },
      },
      {
        key: 'render',
        value: function render() {
          return _react.default.createElement(
              'aside',
              {
                className: 'wrapper-sidemenu',
              },
              _react.default.createElement(
                  'ul',
                  {
                    className: 'side-menu',
                  },
                  _react.default.createElement(
                      'header',
                      {
                        className: 'header',
                      },
                      _react.default.createElement(
                          'i',
                          {
                            className: 'icon',
                          },
                          this.getImage('logo', 'spot-logo')
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'InMall View'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('inmall', 'inmall-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Customer View'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('customer', 'customer-view-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Instore View'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('instoreview', 'instore-view-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Flash'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('flash', 'flash-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Campanhas'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('campaigns', 'campaigns-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Promo\xE7\xF5es'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('promos', 'promos-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'SAC'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('sac', 'sac-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Frald\xE1rio'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('babycare', 'babycare-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Sala VIP'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('viplounge', 'vip-lounge-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Transa\xE7\xF5es'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('coupons', 'coupons-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'li',
                      {
                        className: 'list',
                      },
                      _react.default.createElement(
                          'a',
                          {
                            href: '.',
                            className: 'link',
                          },
                          _react.default.createElement(
                              'strong',
                              {
                                className: 'section-title',
                              },
                              'Configura\xE7\xF5es'
                          ),
                          _react.default.createElement(
                              'i',
                              {
                                className: 'icon',
                              },
                              this.getImage('settings', 'settings-logo')
                          )
                      )
                  ),
                  _react.default.createElement(
                      'footer',
                      {
                        className: 'footer',
                      },
                      _react.default.createElement(
                          'div',
                          {
                            className: '_left',
                          },
                          'v. 2.0.0'
                      ),
                      _react.default.createElement(
                          'div',
                          {
                            className: '_right',
                          },
                          _react.default.createElement('img', {
                            alt: 'mall-logo',
                            src: '',
                          })
                      )
                  )
              )
          );
        },
      },
    ]);

    return Sidemenu;
  })(_react.default.Component);

const _default = Sidemenu;
exports.default = _default;

// # sourceMappingURL=Sidemenu.js.map
