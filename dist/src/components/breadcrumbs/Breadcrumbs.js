'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Breadcrumbs = function Breadcrumbs(props) {
  return _react.default.createElement(
    'div',
    {
      className: 'wrapper-breadcrumbs',
    },
      _react.default.createElement(
      'ol',
      {
        className: 'breadcrumbs',
      },
      _react.default.createElement(
        'li',
        {
                className: 'item',
              },
        props.sections[0]
      ),
      _react.default.createElement(
        'li',
        {
                className: 'item',
        },
              props.sections[1]
      )
      )
  );
};

const _default = Breadcrumbs;
exports.default = _default;

// # sourceMappingURL=Breadcrumbs.js.map
