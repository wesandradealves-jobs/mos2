'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

const _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const SectionTitle = function SectionTitle(props) {
  return _react.default.createElement(
      _reactBootstrap.Row,
      null,
      _react.default.createElement(
          _reactBootstrap.Col,
          {
            id: 'page-title-container',
          },
          _react.default.createElement(
              'h1',
              {
                className: 'page-title',
              },
              props.title
          )
      )
  );
};

const _default = SectionTitle;
exports.default = _default;

// # sourceMappingURL=SectionTitle.js.map
