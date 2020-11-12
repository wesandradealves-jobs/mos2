'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const cepMask = function cepMask(value) {
  return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
};

const _default = cepMask;
exports.default = _default;

// # sourceMappingURL=cepMask.js.map
