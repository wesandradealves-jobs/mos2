'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const UserMenu = function UserMenu(props) {
  return _react.default.createElement(
    'div',
    {
      className: 'wrapper-usermenu dropdown-menu2',
    },
      _react.default.createElement(
      'label',
      {
        className: 'user-menu',
        htmlFor: 'dropdown-menu',
      },
      _react.default.createElement(
        'figure',
        {
                className: 'image',
              },
              _react.default.createElement(
                  'span',
          {
                    className: 'user-settings-avatar-name',
          },
                  'JJ'
              )
      ),
      _react.default.createElement(
        'span',
        {
                className: 'name',
        },
              props.fullName
      )
    ),
      _react.default.createElement('input', {
        id: 'dropdown-menu',
      className: 'open',
      type: 'checkbox',
      'aria-hidden': 'true',
      hidden: true,
      }),
    _react.default.createElement('label', {
        htmlFor: 'dropdown-menu',
      className: 'overlay',
    }),
      _react.default.createElement(
      'div',
      {
        className: 'inner',
      },
      _react.default.createElement(
        'div',
        {
                className: 'header',
              },
        _react.default.createElement(
          'span',
          {
                    className: 'title',
          },
                  props.fullName
              ),
        _react.default.createElement(
          'span',
          {
                    className: 'subtitle',
          },
          props.department
              )
      ),
      _react.default.createElement(
        'div',
              {
          className: 'item',
        },
              'Configura\xE7\xF5es'
      ),
      _react.default.createElement(
        'div',
        {
                className: 'item',
        },
              'Sair'
      )
      )
  );
};

const _default = UserMenu;
exports.default = _default;

// # sourceMappingURL=UserMenu.js.map
