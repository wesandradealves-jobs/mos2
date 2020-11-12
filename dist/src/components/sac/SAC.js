'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _react = _interopRequireDefault(require('react'));

const _reactSelect = _interopRequireDefault(require('react-select'));

const _reactBootstrap = require('react-bootstrap');

const _inputcpf = _interopRequireDefault(require('../inputcpf'));

const _inputcep = _interopRequireDefault(require('../inputcep'));

const _inputphone = _interopRequireDefault(require('../inputphone'));

const _fileselector = _interopRequireDefault(require('../fileselector'));

const _constants = require('../../constants');

const _loadselect = _interopRequireDefault(require('../loadselect'));

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

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ?
    Object.getPrototypeOf :
    function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }
  return self;
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

const SAC =
  /* #__PURE__*/
  (function(_React$Component) {
    _inherits(SAC, _React$Component);

    function SAC(props) {
      let _this;

      _classCallCheck(this, SAC);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SAC).call(this, props));
      _this.state = {
        maxChars: 100,
        writtenChars: 0,
        occurrenceActive: '',
        clientCpf: '',
        clientCep: '',
        clientPhone: '',
        mallDepartments: [
          {
            value: 'Jurídico',
            label: 'Jurídico',
          },
          {
            value: 'Marketing',
            label: 'Marketing',
          },
          {
            value: 'Operações',
            label: 'Operações',
          },
          {
            value: 'Experiência do Cliente',
            label: 'Experiência do Cliente',
          },
          {
            value: 'Segurança',
            label: 'Segurança',
          },
          {
            value: 'Estacionamento',
            label: 'Estacionamento',
          },
        ],
        attachment: null,
        selectedOptions: '',
        vehicleDataActive: '',
        vehicleToggleActive: '',
        location: '',
        clubContractActive: '',
      };
      _this.handleCpfChange = _this.handleCpfChange.bind(_assertThisInitialized(_this));
      _this.handleCepChange = _this.handleCepChange.bind(_assertThisInitialized(_this));
      _this.handlePhoneChange = _this.handlePhoneChange.bind(_assertThisInitialized(_this));
      _this.handleDepartmentChange = _this.handleDepartmentChange.bind(_assertThisInitialized(_this));
      _this.handleAttachmentChange = _this.handleAttachmentChange.bind(_assertThisInitialized(_this));
      _this.handleToggleSwitch = _this.handleToggleSwitch.bind(_assertThisInitialized(_this));
      _this.handleLocation = _this.handleLocation.bind(_assertThisInitialized(_this));
      _this.handleSupportType = _this.handleSupportType.bind(_assertThisInitialized(_this));
      _this.handleClubChoice = _this.handleClubChoice.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(SAC, [
      {
        key: 'handleDescriptionCharsChange',
        value: function handleDescriptionCharsChange(event) {
          const currentText = event.target.value;
          this.setState({
            maxChars: 100,
            writtenChars: currentText.length,
          });
        }, // TODO refatorar essas funções em uma só
      },
      {
        key: 'handleCpfChange',
        value: function handleCpfChange(event) {
          this.setState({
            clientCpf: (0, _inputcpf.default)(event.target.value),
          });
        },
      },
      {
        key: 'handleCepChange',
        value: function handleCepChange(event) {
          this.setState({
            clientCep: (0, _inputcep.default)(event.target.value),
          });
        },
      },
      {
        key: 'handlePhoneChange',
        value: function handlePhoneChange(event) {
          this.setState({
            clientPhone: (0, _inputphone.default)(event.target.value),
          });
        },
      },
      {
        key: 'handleDepartmentChange',
        value: function handleDepartmentChange(selectedOption) {
          this.setState({
            selectedOptions: selectedOption,
          });
        },
      },
      {
        key: 'handleAttachmentChange',
        value: function handleAttachmentChange(file) {
          this.setState({
            attachment: file,
          });
        },
      },
      {
        key: 'handleToggleSwitch',
        value: function handleToggleSwitch(event) {
          if (event.target.checked) {
            this.setState({
              vehicleDataActive: 'active',
            });
          } else {
            this.setState({
              vehicleDataActive: '',
            });
          }
        },
      },
      {
        key: 'handleLocation',
        value: function handleLocation(event) {
          const _this2 = this;

          this.setState(
              {
                location: event.target.value,
              },
              function() {
                return _this2.state.location === 'parking-lot' ?
                _this2.setState({
                  vehicleToggleActive: 'active',
                }) :
                _this2.setState({
                  vehicleToggleActive: '',
                  vehicleDataActive: '',
                });
              }
          );
        },
      },
      {
        key: 'handleSupportType',
        value: function handleSupportType(event) {
          if (event.target.value === 'occurrence') {
            this.setState({
              occurrenceActive: 'active',
            });
          } else {
            this.setState({
              occurrenceActive: '',
              vehicleToggleActive: '',
              vehicleDataActive: '',
              selectedOptions: '',
              location: '',
              clientCpf: '',
              clientCep: '',
              attachment: null,
              clubContractActive: '',
            });
          }
        },
      },
      {
        key: 'handleClubChoice',
        value: function handleClubChoice(event) {
          console.log(event.target.value);

          if (event.target.value === 'yes') {
            this.setState({
              clubContractActive: 'active',
            });
          } else {
            this.setState({
              clubContractActive: '',
            });
          }
        },
      },
      {
        key: 'render',
        value: function render() {
          const { selectedOption } = this.state;
          return _react.default.createElement(
              'section',
              {
                className: 'content',
              },
              _react.default.createElement(
                  'form',
                  null,
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        lg: 12,
                        className: 'mall-and-support',
                      },
                      _react.default.createElement(
                          _reactBootstrap.Col,
                          {
                            lg: 3,
                            md: 3,
                            xs: 12,
                          },
                          _react.default.createElement(
                              'label',
                              {
                                className: 'label-input',
                              },
                              'Shopping*'
                          ),
                          _react.default.createElement(
                              'select',
                              {
                                defaultValue: 'DEFAULT',
                              },
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: 'DEFAULT',
                                    disabled: true,
                                  },
                                  '-- Selecione --'
                              ),
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: '',
                                  },
                                  'aaa'
                              ),
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: '',
                                  },
                                  'aaa'
                              ),
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: '',
                                  },
                                  'aaa'
                              )
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Col,
                          {
                            lg: 3,
                            md: 3,
                            xs: 12,
                          },
                          _react.default.createElement(
                              'label',
                              {
                                className: 'label-input',
                              },
                              'Tipo de atendimento*'
                          ),
                          _react.default.createElement(
                              'select',
                              {
                                defaultValue: 'DEFAULT',
                                onChange: this.handleSupportType,
                              },
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: 'DEFAULT',
                                    disabled: true,
                                  },
                                  '-- Selecione --'
                              ),
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: 'express-service',
                                  },
                                  'Atendimento R\xE1pido'
                              ),
                              _react.default.createElement(
                                  'option',
                                  {
                                    value: 'occurrence',
                                  },
                                  'Ocorr\xEAncia'
                              )
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Col,
                          {
                            className: 'support-channels',
                            lg: 6,
                            md: 6,
                            xs: 12,
                          },
                          _react.default.createElement(
                              _reactBootstrap.Row,
                              null,
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input',
                                  },
                                  'Canal de atendimento*'
                              )
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Row,
                              {
                                className: 'radio-buttons-container',
                              },
                              _react.default.createElement(
                                  _reactBootstrap.Col,
                                  {
                                    lg: 3,
                                    className: 'radio-button-container',
                                  },
                                  _react.default.createElement(
                                      'label',
                                      {
                                        className: 'checkbox',
                                      },
                                      _react.default.createElement('input', {
                                        type: 'radio',
                                        name: 'service-channel',
                                        value: 'PRESENCIAL',
                                      }),
                                      _react.default.createElement('span', {
                                        className: 'checkmark',
                                      }),
                                      _react.default.createElement(
                                          'span',
                                          {
                                            className: 'radio-label-text',
                                          },
                                          'Presencial'
                                      )
                                  )
                              ),
                              _react.default.createElement(
                                  _reactBootstrap.Col,
                                  {
                                    lg: 3,
                                    className: 'radio-button-container',
                                  },
                                  _react.default.createElement(
                                      'label',
                                      {
                                        className: 'checkbox',
                                      },
                                      _react.default.createElement('input', {
                                        type: 'radio',
                                        name: 'service-channel',
                                        value: 'TELEFONE',
                                      }),
                                      _react.default.createElement('span', {
                                        className: 'checkmark',
                                      }),
                                      _react.default.createElement(
                                          'span',
                                          {
                                            className: 'radio-label-text',
                                          },
                                          'Telefone'
                                      )
                                  )
                              ),
                              _react.default.createElement(
                                  _reactBootstrap.Col,
                                  {
                                    lg: 3,
                                    className: 'radio-button-container',
                                  },
                                  _react.default.createElement(
                                      'label',
                                      {
                                        className: 'checkbox',
                                      },
                                      _react.default.createElement('input', {
                                        type: 'radio',
                                        name: 'service-channel',
                                        value: 'WHATSAPP',
                                      }),
                                      _react.default.createElement('span', {
                                        className: 'checkmark',
                                      }),
                                      _react.default.createElement(
                                          'span',
                                          {
                                            className: 'radio-label-text',
                                          },
                                          'Whatsapp'
                                      )
                                  )
                              ),
                              _react.default.createElement(
                                  _reactBootstrap.Col,
                                  {
                                    lg: 3,
                                    className: 'radio-button-container',
                                  },
                                  _react.default.createElement(
                                      'label',
                                      {
                                        className: 'checkbox',
                                      },
                                      _react.default.createElement('input', {
                                        type: 'radio',
                                        name: 'service-channel',
                                        value: 'OUTRO',
                                      }),
                                      _react.default.createElement('span', {
                                        className: 'checkmark',
                                      }),
                                      _react.default.createElement(
                                          'span',
                                          {
                                            className: 'radio-label-text',
                                          },
                                          'Outro'
                                      )
                                  )
                              )
                          )
                      )
                  ),
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        className: 'occurrence-fields input-fields-container '.concat(this.state.occurrenceActive),
                      },
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          {
                            className: 'occurrence-fields-title',
                          },
                          _react.default.createElement(
                              'span',
                              {
                                className: 'label-input',
                              },
                              'Dados Gerais'
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                                md: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'CPF*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'clientCpf',
                                value: this.state.clientCpf,
                                maxLength: '14',
                                onChange: this.handleCpfChange,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                                md: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'CEP*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'clientCep',
                                value: this.state.clientCep,
                                maxLength: '9',
                                onChange: this.handleCepChange,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                                md: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Motivo*'
                              ),
                              _react.default.createElement(_loadselect.default, {
                                selectUrl: _constants.EP_REASON,
                              })
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              null,
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Nome*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              null,
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Local*'
                              ),
                              _react.default.createElement(
                                  'select',
                                  {
                                    value: this.state.location ? this.state.location : 'DEFAULT',
                                    onChange: this.handleLocation,
                                  },
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'DEFAULT',
                                        disabled: true,
                                      },
                                      '-- Selecione --'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'toilet',
                                      },
                                      'Banheiros'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'parking-lot',
                                      },
                                      'Estacionamentos'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'stores',
                                      },
                                      'Lojas'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'mall',
                                      },
                                      'Mall'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'food-court',
                                      },
                                      'Pra\xE7a de Alimenta\xE7\xE3o'
                                  )
                              )
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'G\xEAnero*'
                              ),
                              _react.default.createElement(
                                  'select',
                                  {
                                    defaultValue: 'DEFAULT',
                                  },
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'DEFAULT',
                                        disabled: true,
                                      },
                                      '-- Selecione --'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Feminino'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Masculino'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Outros'
                                  )
                              )
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Data de Nascimento*'
                              ),
                              _react.default.createElement('input', {
                                type: 'date',
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Assunto*'
                              ),
                              _react.default.createElement(
                                  'select',
                                  {
                                    defaultValue: 'DEFAULT',
                                  },
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: 'DEFAULT',
                                        disabled: true,
                                      },
                                      '-- Selecione --'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Banheiros - Atendimento / Informa\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Banheiros - Limpeza'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Banheiros - Manuten\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Atendimento/Informa\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Cobran\xE7a'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Colis\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Limpeza'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Manuten\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Estacionamentos - Ticket perdido'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Lojas - Atendimento/Informa\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Lojas - Atendimento/Troca'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Lojas - Limpeza e produtos'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Atendimento/Informa\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Bebedouro'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Elevadores'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Escada rolante'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Limpeza'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Mall - Manuten\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Pra\xE7a de Alimenta\xE7\xE3o - Atendimento/Informa\xE7\xE3o'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Pra\xE7a de Alimenta\xE7\xE3o - Conforto'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Pra\xE7a de Alimenta\xE7\xE3o - Limpeza'
                                  ),
                                  _react.default.createElement(
                                      'option',
                                      {
                                        value: '',
                                      },
                                      'Pra\xE7a de Alimenta\xE7\xE3o - Manuten\xE7\xE3o'
                                  )
                              )
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'E-mail*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Telefone*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'clientPhone',
                                maxLength: '15',
                                value: this.state.clientPhone,
                                onChange: this.handlePhoneChange,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Anexar*'
                              ),
                              _react.default.createElement(_fileselector.default, {
                                name: 'arquivo',
                                onChange: this.handleAttachmentChange,
                              })
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                              },
                              _react.default.createElement(
                                  _reactBootstrap.Row,
                                  null,
                                  _react.default.createElement(
                                      _reactBootstrap.Col,
                                      {
                                        lg: 6,
                                        className: 'club-choice',
                                      },
                                      _react.default.createElement(
                                          'label',
                                          {
                                            className: 'label-input form-input already-client',
                                          },
                                          'Cliente j\xE1 faz parte do clube'
                                      ),
                                      _react.default.createElement(
                                          'label',
                                          {
                                            className: 'label-input club-desire form-input active',
                                          },
                                          'Deseja fazer parte do clube?'
                                      ),
                                      _react.default.createElement(
                                          _reactBootstrap.Row,
                                          {
                                            className: 'radio-buttons-container',
                                          },
                                          _react.default.createElement(
                                              _reactBootstrap.Col,
                                              {
                                                lg: 3,
                                                className: 'radio-button-container',
                                                id: 'club-desire-choice',
                                              },
                                              _react.default.createElement(
                                                  'label',
                                                  {
                                                    className: 'checkbox',
                                                  },
                                                  _react.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'club-desire',
                                                    value: 'yes',
                                                    onChange: this.handleClubChoice,
                                                  }),
                                                  _react.default.createElement('span', {
                                                    className: 'checkmark',
                                                  }),
                                                  _react.default.createElement(
                                                      'span',
                                                      {
                                                        className: 'radio-label-text',
                                                      },
                                                      'Sim'
                                                  )
                                              )
                                          ),
                                          _react.default.createElement(
                                              _reactBootstrap.Col,
                                              {
                                                lg: 3,
                                                className: 'radio-button-container',
                                              },
                                              _react.default.createElement(
                                                  'label',
                                                  {
                                                    className: 'checkbox',
                                                  },
                                                  _react.default.createElement('input', {
                                                    type: 'radio',
                                                    name: 'club-desire',
                                                    value: 'no',
                                                    onChange: this.handleClubChoice,
                                                  }),
                                                  _react.default.createElement('span', {
                                                    className: 'checkmark',
                                                  }),
                                                  _react.default.createElement(
                                                      'span',
                                                      {
                                                        className: 'radio-label-text',
                                                      },
                                                      'N\xE3o'
                                                  )
                                              )
                                          )
                                      )
                                  ),
                                  _react.default.createElement(
                                      _reactBootstrap.Col,
                                      {
                                        lg: 6,
                                        className: 'club-contract '.concat(this.state.clubContractActive),
                                      },
                                      _react.default.createElement(
                                          'label',
                                          {
                                            className: 'label-input form-input',
                                          },
                                          'Enviar termo de aceita\xE7\xE3o'
                                      ),
                                      _react.default.createElement(
                                          'select',
                                          {
                                            defaultValue: 'DEFAULT',
                                          },
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: 'DEFAULT',
                                                disabled: true,
                                              },
                                              '-- Selecione --'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: 'email',
                                              },
                                              'E-mail'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: 'sms',
                                              },
                                              'SMS'
                                          )
                                      )
                                  )
                              )
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              null,
                              _react.default.createElement(
                                  _reactBootstrap.Row,
                                  null,
                                  _react.default.createElement(
                                      _reactBootstrap.Col,
                                      {
                                        lg: 6,
                                      },
                                      _react.default.createElement(
                                          'label',
                                          {
                                            className: 'label-input form-input',
                                          },
                                          'Status'
                                      ),
                                      _react.default.createElement(
                                          'select',
                                          {
                                            defaultValue: 'DEFAULT',
                                          },
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: 'DEFAULT',
                                                disabled: true,
                                              },
                                              '-- Selecione --'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: '',
                                              },
                                              'Em andamento'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: '',
                                              },
                                              'Pendente'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: '',
                                              },
                                              'Aprova\xE7\xE3o'
                                          ),
                                          _react.default.createElement(
                                              'option',
                                              {
                                                value: '',
                                              },
                                              'Urg\xEAncia'
                                          )
                                      )
                                  ),
                                  _react.default.createElement(
                                      _reactBootstrap.Col,
                                      {
                                        lg: 6,
                                      },
                                      _react.default.createElement(
                                          'label',
                                          {
                                            className: 'label-input form-input',
                                          },
                                          'Encaminhar Registro'
                                      ),
                                      _react.default.createElement(_reactSelect.default, {
                                        isMulti: true,
                                        className: 'basic-multi-select',
                                        value: selectedOption,
                                        onChange: this.handleDepartmentChange,
                                        options: this.state.mallDepartments,
                                      })
                                  )
                              )
                          )
                      )
                  ),
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        className: 'vehicle-toggle-switch '.concat(this.state.vehicleToggleActive),
                      },
                      _react.default.createElement(
                          'label',
                          {
                            className: 'text-uppercase toggle-switch-label',
                          },
                          'Inserir dados do ve\xEDculo'
                      ),
                      _react.default.createElement(
                          'span',
                          {
                            className: 'switch switch-sm',
                          },
                          _react.default.createElement('input', {
                            type: 'checkbox',
                            className: 'switch',
                            id: 'switch-sm',
                            onChange: this.handleToggleSwitch,
                          }),
                          _react.default.createElement('label', {
                            htmlFor: 'switch-sm',
                          })
                      )
                  ),
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        className: 'input-fields-container vehicle-data '.concat(this.state.vehicleDataActive),
                      },
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          {
                            lg: 12,
                            md: 12,
                          },
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                                md: 6,
                              },
                              _react.default.createElement(
                                  'span',
                                  {
                                    className: 'label-input',
                                  },
                                  'Dados do ve\xEDculo'
                              )
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          null,
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                                md: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Ve\xEDculo*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'vehicle',
                                maxLength: '50',
                                value: this.state.vehicle,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                                md: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Marca*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'brand',
                                maxLength: '20',
                                value: this.state.vehicleBrand,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                                md: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Nome do condutor'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'driverName',
                                maxLength: '50',
                                value: this.state.driverName,
                              })
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          {
                            lg: 12,
                          },
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Placa*'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'vehiclePlate',
                                maxLength: '10',
                                value: this.state.vehiclePlate,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Cor'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'vehicleColor',
                                maxLength: '50',
                                value: this.state.vehicleColor,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Chassi'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'chassi',
                                maxLength: '30',
                                value: this.state.chassi,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'RENAVAM'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'renavam',
                                maxLength: '15',
                                value: this.state.renavam,
                              })
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          {
                            lg: 12,
                          },
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Ano'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'vehicleYear',
                                maxLength: '6',
                                value: this.state.vehicleYear,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Local da ocorr\xEAncia'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'occurrencePlace',
                                maxLength: '25',
                                value: this.state.occurrencePlace,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Ticket/Meio de pagamento autom\xE1tico'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'ticket',
                                maxLength: '20',
                                value: this.state.ticket,
                              })
                          )
                      ),
                      _react.default.createElement(
                          _reactBootstrap.Row,
                          {
                            lg: 12,
                          },
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Cidade'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'city',
                                maxLength: '25',
                                value: this.state.city,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 3,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'UF'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'uf',
                                maxLength: '2',
                                value: this.state.uf,
                              })
                          ),
                          _react.default.createElement(
                              _reactBootstrap.Col,
                              {
                                lg: 6,
                              },
                              _react.default.createElement(
                                  'label',
                                  {
                                    className: 'label-input form-input',
                                  },
                                  'Comprovante do seguro'
                              ),
                              _react.default.createElement('input', {
                                type: 'text',
                                name: 'insuranceProof',
                                maxLength: '50',
                                value: this.state.insuranceProof,
                              })
                          )
                      )
                  ),
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        id: 'service-description',
                      },
                      _react.default.createElement(
                          _reactBootstrap.Col,
                          {
                            className: 'input-fields-container',
                            lg: 12,
                          },
                          _react.default.createElement(
                              'label',
                              {
                                className: 'label-input form-input',
                              },
                              'Descri\xE7\xE3o do atendimento*',
                              _react.default.createElement('textarea', {
                                cols: '200',
                                maxLength: '100',
                                onChange: this.handleDescriptionCharsChange.bind(this),
                              })
                          ),
                          _react.default.createElement(
                              'div',
                              {
                                className: '_text-right',
                              },
                              _react.default.createElement(
                                  'span',
                                  {
                                    className: 'components-subtitle',
                                  },
                                  this.state.writtenChars,
                                  '/',
                                  this.state.maxChars
                              )
                          )
                      )
                  ),
                  _react.default.createElement(
                      _reactBootstrap.Row,
                      {
                        className: 'button-disclaimer-row',
                      },
                      _react.default.createElement(
                          _reactBootstrap.Col,
                          {
                            className: 'input-fields-container',
                          },
                          _react.default.createElement(
                              'span',
                              {
                                className: 'obs align-left',
                              },
                              '*Campos obrigat\xF3rios'
                          ),
                          _react.default.createElement(
                              'button',
                              {
                                className: 'button-default -action -small align-center',
                              },
                              'Salvar'
                          )
                      )
                  )
              )
          );
        },
      },
    ]);

    return SAC;
  })(_react.default.Component);

const _default = SAC;
exports.default = _default;

// # sourceMappingURL=SAC.js.map
