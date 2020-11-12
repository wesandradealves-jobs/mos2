import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import _ from 'lodash';
import ApiClient from '../../../services/api';
import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../../utils/masks';

import FileSelector from '../../../components/fileselector';

const PARKING_LOCATION_ID = 16;

class SAC extends React.Component {
  constructor(props) {
    super(props);

    this.environment = 'staging';
    this.client = new ApiClient();
    this.popUp = withReactContent(Swal);

    /* Definição dos campos */
    this.fields = {
      mallId: { required: true, default: '', type: 'integer' },
      types: { required: true, options: [], type: 'string' },
      channels: {
        required: true,
        default: '',
        options: [],
        type: 'integer',
        group: 'ticket',
      },
      customer: {
        fullName: {
          required: true,
          onSubmit: fullName => fullName.match(/\S{1,80}/),
          error: '',
        },
        cpf: {
          required: true,
          group: 'customer',
          filter: cpf => cpf.replace(/\D/g, ''),
          onChange: 'getCustomerData',
          onSubmit: cpf => cpf.match(/\d{11}/),
          error: '',
        },
        zipCode: {
          required: true,
          filter: cep => cep.replace(/\D/g, ''),
          onSubmit: zipCode => zipCode.match(/\d{8}/),
          error: '',
        },
        sex: {
          required: true,
          onSubmit: sex => sex.match(/^M$|^F$|^O$/g),
          error: '',
        },
        birthday: {
          required: true,
          onSubmit: birthday =>
            birthday.match(
              /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
            ),
          error: '',
        },
        email: {
          required: true,
          onSubmit: email =>
            email.match(
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            ),
          error: '',
        },
        mobileNumber: {
          required: true,
          group: 'customer',
          onSubmit: mobileNumber => mobileNumber.match(/\S{10,11}/),
          filter: phone => phone.replace(/\D/g, ''),
          error: '',
        },
      },
      reasons: {
        required: true,
        options: [],
        type: 'integer',
      },
      locations: {
        required: true,
        options: [],
        type: 'integer',
      },
      subjects: {
        required: true,
        options: [],
        type: 'integer',
      },
      ticket: {
        comment: {
          required: true,
          type: 'string',
          onSubmit: comment => comment.match(/\S{2,5000}/),
          error: '',
        },
        statusId: {
          options: [],
          type: 'integer',
          onSubmit: value => value != 0,
        },
        attachmentUri: { options: [] },
        forwardGroups: { options: [], type: 'integer' },
        location: { options: [], type: 'string' },
        channelId: {
          required: true,
          type: 'integer',
          error: '',
          onSubmit: value => value != 0,
        },
        reasonId: {
          required: true,
          type: 'integer',
          error: '',
          onSubmit: value => value != 0,
        },
        forwardGroupIds: {},
        employeeId: {
          required: true,
          type: 'integer',
          error: '',
          onSubmit: value => value != 0,
        },
      },
      vehicle: {
        type: {
          required: true,
          type: 'string',
          onSubmit: type => type.match(/\S{1,40}/),
          error: '',
        },
        brand: {
          required: true,
          type: 'string',
          onSubmit: brand => brand.match(/\S{1,20}/),
          error: '',
        },
        driverName: { type: 'string' },
        licensePlate: {
          required: true,
          type: 'string',
          onSubmit: value => value.length == 7,
          error: '',
        },
        color: { type: 'string' },
        chassis: { type: 'string' },
        renavam: { type: 'string' },
        year: { type: 'string' },
        ocurrenceLocation: { type: 'string' },
        paymentTicket: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        insuranceProof: { type: 'string' },
      },
    };

    this.initialState = {
      activeFields: [],
      maxChars: 100,
      writtenChars: 0,
      malls: this.props.sessionSpot.malls,
      mallId: this.props.sessionSpot.malls[0].id,
      selectedOptions: '',
      vehicleToggle: false,
      vehicleSwitch: false,
      location: '',
      // Propriedades necessárias para mandar o POST de criação de Ticket
      ticket: {
        channelId: 0,
        reasonId: 0,
        statusId: 1,
        forwardGroupIds: [],
        comment: '',
        // attachmentUri: null,
        // clubAcceptanceChannel: "",
        employeeId: this.props.sessionSpot.user.id,
      },
      customer: {
        cpf: '',
        zipCode: '',
        fullName: '',
        sex: 'DEFAULT',
        birthday: '',
        email: '',
        mobileNumber: '',
      },
      vehicle: {
        type: '',
        brand: '',
        licensePlate: '',
        color: '',
        year: '',
        city: '',
        state: '',
        driverName: '',
        chassis: '',
        renavam: '',
        paymentTicket: '',
        insuranceProof: '',
        ocurrenceLocation: '',
      },
    };

    this.state = this.initialState;

    this.handleChange = this.handleChange.bind(this);

    this.renderOccurrenceFields = this.renderOccurrenceFields.bind(this);

    this.handleForwardGroupChange = this.handleForwardGroupChange.bind(this);
    this.handleAttachmentChange = this.handleAttachmentChange.bind(this);
    this.handleToggleSwitch = this.handleToggleSwitch.bind(this);
    this.handleSupportType = this.handleSupportType.bind(this);
    this.handleClubChoice = this.handleClubChoice.bind(this);
    this.sendTicket = this.sendTicket.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  async getApiData(propertyName, fieldName) {
    let data = await this.client.getData(propertyName, this.state.mallId);
    if (propertyName === 'forward-groups') {
      data = data.map(group => ({ value: group.id, label: group.name }));
    }
    _.get(this.fields, fieldName).options = data;
    this.setState({ state: this.state });
  }

  async getCustomerData(clientCpf) {
    if (clientCpf.length === 11) {
      const data = await this.client.getCustomerData(clientCpf);
      if (data) {
        this.setState({
          customer: { ...this.state.customer, ...data },
        });
      }
    }
  }

  async sendTicket(event) {
    event.preventDefault();

    if (this.state.types === 'ticket') {
      const doNotPrint = false;
      const ticketContent = {
        ticket: this.state.ticket,
        customer: this.state.customer,
      };

      if (this.state.vehicleToggle) {
        ticketContent.vehicle = this.state.vehicle;
      }

      delete ticketContent.customer.cluster;

      await this.validateFields(ticketContent);

      if (this.state.isValid === false) {
        this.ticketFailldPopup();
        return false; // Tem que interromper a execução
      }

      this.client
        .sendTicket(this.state.mallId, ticketContent)
        .then(newTicketId => this.ticketUpdatePopup(doNotPrint, newTicketId))
        .catch(err => console.error(err));
    } else {
      const doNotPrint = true;
      const ticketContent = {
        channelId: this.state.ticket.channelId,
        comment: this.state.ticket.comment,
        employeeId: this.state.ticket.employeeId,
      };
      await this.validateFields(ticketContent);

      if (this.state.isValid === false) {
        this.ticketFailldPopup();
        return false; // Tem que interromper a execução
      }

      if (this.state.vehicleToggle) {
        ticketContent.vehicle = this.state.vehicle;
      }

      // @TODO Validar campos aqui?
      this.client
        .sendTicket(this.state.mallId, ticketContent)
        .then(newTicketId => this.ticketUpdatePopup(doNotPrint, newTicketId))
        .catch(err => console.error(err));
    }
  }

  async validateFields(obj) {
    let areFieldsValidated = true;

    if (this.state.types === 'ticket') {
      // console.log("Ticket Normal")

      for (var [section, value] of Object.entries(obj)) {
        for (var [key, value] of Object.entries(obj[section])) {
          var fieldOptions = _.get(this.fields[section], key);
          console.log(fieldOptions);
          console.log('Chave', section, key, value, fieldOptions);
          if (fieldOptions && fieldOptions.onSubmit !== undefined) {
            var isValid = fieldOptions.onSubmit(value);
            if (!isValid) {
              console.log('Erro', isValid);
              this.fields[section][key].error = 'input-error';
              areFieldsValidated = false;
            } else {
              this.fields[section][key].error = '';
            }
          }
        }
      }
    } else {
      // console.log("Ticket Curto")

      for (var [section, value] of Object.entries(obj)) {
        console.log(
          `Essa é minha chave: ${section} Esse é meu valor: ${value}`
        );
        var fieldOptions = this.fields.ticket[section];
        console.log(fieldOptions.onSubmit == undefined);

        if (fieldOptions.onSubmit !== undefined) {
          var isValid = fieldOptions.onSubmit(value);
          console.log(isValid);
          if (!isValid) {
            console.log('Erro', isValid);
            fieldOptions.error = 'input-error';
            areFieldsValidated = false;
          } else {
            fieldOptions.error = '';
          }
        }
      }
    }
    if (areFieldsValidated) {
      return this.setState({ isValid: true });
    }
    this.setState({ isValid: false }, () => this.ticketFailldPopup());
  }

  resetState() {
    // @TODO reset fields - Channel - MallId6
    this.initialState.customer.cpf = '';
    this.setState(this.initialState);
  }

  resetState() {
    // @TODO reset fields - Channel - MallId6
    this.setState(this.initialState);
  }

  async componentDidMount() {
    this.getApiData('reasons', 'reasons');
    this.getApiData('channels', 'channels');
    this.getApiData('status', 'ticket.statusId');
    this.getApiData('types', 'types');
    this.getApiData('forward-groups', 'ticket.forwardGroups');
    this.setState({ ready: true });
  }

  /**
   * lida com as atualizações dos campos do formulário
   * - pega o nome do campo
   * - seta no estado
   * - se o campo tiver onChange
   *   chama a função
   * @param {Event} event
   */

  async handleChange(event) {
    const { target } = event;
    let { value } = target;
    let fieldName = target.dataset.field;
    const fieldOptions = _.get(this.fields, fieldName);
    const { group } = _.get(this.fields, fieldName);
    let data;

    console.log(fieldOptions);
    if (fieldName && fieldOptions) {
      // TODO refatorar

      if (fieldOptions.type === 'integer') {
        value = parseInt(value);
      }

      if (fieldOptions.filter !== undefined) {
        value = fieldOptions.filter(value);
      }

      switch (fieldName) {
        case 'reasons':
          data = await this.client.getReasons(this.state.mallId, value);
          this.fields.locations.options = data;
          this.setState({
            reasonId: value,
            locationId: 'DEFAULT',
            subjectId: 'DEFAULT',
          });
          break;
        case 'locations':
          data = await this.client.getReasons(this.state.mallId, value);
          this.fields.subjects.options = data;
          this.setState({ locationId: value, subjectId: 'DEFAULT' });
          break;
        case 'subjects':
          this.setState(prevState => ({
            subjectId: value,
            ticket: {
              ...prevState.ticket,
              reasonId: value,
            },
          }));
          break;

        case 'channels':
          fieldName = fieldName.slice(0, -1);
          fieldName = `${fieldName}Id`;
          var { ticket } = this.state;
          ticket.channelId = value;
          this.setState({ ticket });
          break;

        case 'status':
          fieldName = `${fieldName}Id`;
          break;

        case 'mallId':
          this.setState({ mallId: value }, () => {
            this.getApiData('reasons', 'reasons');
            this.getApiData('channels', 'channels');
            this.getApiData('status', 'ticket.statusId');
            this.getApiData('types', 'types');
            this.getApiData('forward-groups', 'ticket.forwardGroups');
          });
          break;

        default:
          const change = this.state;
          _.set(change, fieldName, value);
          this.setState({ state: change });
      }

      if (fieldOptions.onChange) {
        if (typeof fieldOptions.onChange === 'string') {
          this[fieldOptions.onChange].call(this, value);
        }
      }
    } else {
      console.error(`no options for field ${fieldName} yet`);
    }
  }

  ticketFailldPopup() {
    const text = `Há campos vazios ou com valores não aceitos`;

    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Campos vazios ou inválidos!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ok',
    });
  }

  // TODO pegar id do response do post e jogar aqui
  ticketUpdatePopup(doNotPrint, returnetTicketId) {
    const printOption = doNotPrint ? '' : 'Deseja imprimir?';
    const ticketId = returnetTicketId || this.state.ticketId;

    const text = doNotPrint
      ? 'Ocorrência salva.'
      : `Ocorrência nº ${ticketId} salva. ${printOption}`;

    const buttons = doNotPrint
      ? {
          confirmButtonText: 'OK',
        }
      : {
          showCancelButton: true,
          confirmButtonText: 'SIM',
          cancelButtonText: 'NÃO',
        };
    this.popUp
      .fire({
        ...buttons,
        icon: 'success',
        text,
        confirmButtonColor: '#54bbab',
      })
      .then(result => {
        if (result.value && !doNotPrint) {
          this.printTicket(ticketId).then(() => this.resetState());
        } else {
          this.resetState();
        }
      });
  }

  async printTicket(returnedTicketId) {
    const ticketId = returnedTicketId || this.props.ticketId;

    const response = await this.client.printTicket(
      ticketId,
      this.state.mallId.toString()
    );

    const retrievedPDF = new Blob([response.data], {
      type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(retrievedPDF);
    window.open(url);
  }

  handleDescriptionCharsChange(event) {
    const currentText = event.target.value;
    this.setState({ maxChars: 100, writtenChars: currentText.length });
    this.setState(prevState => ({
      ticket: {
        ...prevState.ticket,
        comment: currentText,
      },
    }));
  }

  handleForwardGroupChange(selectedOption) {
    if (selectedOption !== null) {
      this.setState(prevState => ({
        ticket: {
          ...prevState.ticket,
          forwardGroupIds: selectedOption.map(option => option.value),
        },
      }));
    } else {
      this.setState(prevState => ({
        ticket: {
          ...prevState.ticket,
          forwardGroupIds: [],
        },
      }));
    }
  }

  async handleAttachmentChange(file) {
    const url = await this.client.uploadAttachment(file);
    console.log('Inside Atta', url, typeof url);

    if (typeof url !== 'undefined') {
      console.log('Inside Atta', encodeURI(url));
      this.setState(prevState => ({
        ticket: {
          ...prevState.ticket,
          attachmentUri: encodeURI(url),
        },
      }));
    }
  }

  handleToggleSwitch(event) {
    if (event.target.checked) {
      this.setState({ vehicleToggle: true, vehicleSwitch: true });
    } else {
      this.setState({ vehicleToggle: false, vehicleSwitch: false });
    }
  }

  handleSupportType(event) {
    if (event.target.value === 'ticket') {
      this.setState({ types: 'ticket' });
    } else if (event.target.value === 'short-ticket') {
      this.setState({ types: 'short-ticket' });
    } else {
      this.setState({
        types: '',
        vehicleToggleActive: '',
        vehicleDataActive: '',
        selectedOptions: '',
        location: '',
        attachment: null,
        clubContractActive: '',
      });
    }
  }

  handleClubChoice(event) {
    if (event.target.value === 'yes') {
      this.setState({ clubContractActive: 'active' });
    } else {
      this.setState({ clubContractActive: '' });
    }
  }

  renderShortDescriptionField() {
    if (this.state.types === 'short-ticket') {
      return (
        <Row id="service-description">
          <Col className="input-fields-container" lg={12}>
            <label className="label-input form-input">
              Descrição do atendimento*
              <textarea
                cols="200"
                maxLength="100"
                value={this.state.ticket.comment}
                onChange={this.handleDescriptionCharsChange.bind(this)}
                className={this.fields.ticket.comment.error}
              />
            </label>
            <div className="_text-right">
              <span className="components-subtitle">
                {this.state.writtenChars}/{this.state.maxChars}
              </span>
            </div>
          </Col>
        </Row>
      );
    }
  }

  renderOccurrenceFields() {
    if (this.state.types === 'ticket') {
      return (
        <section className="occurrence-fields">
          <Row className="occurrence-fields-title">
            <span className="input-group-title">Dados Gerais</span>
          </Row>

          <Row>
            <Col lg={3} md={3}>
              <label className="label-input form-input">CPF*</label>
              <MaskedInput
                mask={cpfMask}
                className={this.fields.customer.cpf.error}
                type="text"
                name="cpf"
                value={this.state.customer.cpf}
                data-field="customer.cpf"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={3} md={3}>
              <label className="label-input form-input">CEP*</label>
              <MaskedInput
                mask={cepMask}
                className={this.fields.customer.zipCode.error}
                type="text"
                name="zipCode"
                value={this.state.customer.zipCode}
                data-field="customer.zipCode"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={6} md={6}>
              <label className="label-input form-input">Motivo*</label>
              <select
                defaultValue="DEFAULT"
                data-field="reasons"
                onChange={this.handleChange}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>

                {this.fields.reasons.options.map(reason => (
                  <option value={reason.id} key={reason.id}>
                    {reason.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row>
            <Col>
              <label className="label-input form-input">Nome*</label>
              <input
                type="text"
                className={this.fields.customer.fullName.error}
                value={this.state.customer.fullName}
                data-field="customer.fullName"
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <label className="label-input form-input">Local*</label>
              <select
                defaultValue="DEFAULT"
                data-field="locations"
                onChange={this.handleChange}
                value={this.state.locationId}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>

                {this.fields.locations.options.map(location => (
                  <option value={location.id} key={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row>
            <Col lg={3}>
              <label className="label-input form-input">Gênero*</label>
              <select
                value={this.state.customer.sex}
                className={this.fields.customer.sex.error}
                data-field="customer.sex"
                onChange={this.handleChange}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outros</option>
              </select>
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">
                Data de Nascimento*
              </label>
              <input
                type="date"
                className={this.fields.customer.birthday.error}
                value={this.state.customer.birthday}
                data-field="customer.birthday"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={6}>
              <label className="label-input form-input">Assunto*</label>
              <select
                defaultValue="DEFAULT"
                data-field="subjects"
                className={this.fields.ticket.reasonId.error}
                onChange={this.handleChange}
                value={this.state.subjectId}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>

                {this.fields.subjects.options.map(subject => (
                  <option value={subject.id} key={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <Row>
            <Col lg={3}>
              <label className="label-input form-input">E-mail*</label>
              <input
                type="text"
                className={this.fields.customer.email.error}
                value={this.state.customer.email}
                data-field="customer.email"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">Telefone*</label>
              <MaskedInput
                mask={phoneMask}
                className={this.fields.customer.mobileNumber.error}
                type="text"
                name="customerPhone"
                value={this.state.customer.mobileNumber}
                data-field="customer.mobileNumber"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={6}>
              <label className="label-input form-input">Anexar</label>
              <FileSelector
                name="arquivo"
                data-field="attachmentUri"
                onChange={this.handleAttachmentChange}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              {this.renderCustomerCluster()}
              {/* {this.renderCustomerClubChoice()} */}
            </Col>

            <Col>
              <Row>
                <Col lg={6}>
                  <label className="label-input form-input">Status</label>
                  <select
                    onChange={this.handleChange}
                    data-field="ticket.statusId"
                    defaultValue={this.state.ticket.statusId}
                  >
                    {this.fields.ticket.statusId.options.map(status => (
                      <option value={status.id} key={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={6}>
                  <label className="label-input form-input">
                    Encaminhar Registro
                  </label>
                  <Select
                    isMulti
                    className="basic-multi-select"
                    value={this.state.selectedOption}
                    onChange={this.handleForwardGroupChange}
                    options={this.fields.ticket.forwardGroups.options}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <label className="label-input form-input">
                Descrição do atendimento*
                <textarea
                  cols="200"
                  className={this.fields.ticket.comment.error}
                  rows="6"
                  maxLength="5000"
                  value={this.state.ticket.comment}
                  onChange={this.handleChange}
                  data-field="ticket.comment"
                />
              </label>
            </Col>
          </Row>

          {/* Botão para exibir ou não os campos de veículo */}
          {this.renderVehicleToggleSwitch()}

          {/* Campos de veículo */}
          {this.renderVehicleFields()}
        </section>
      );
    }
  }

  renderCustomerCluster() {
    if (this.state.customer.cluster === 'active') {
      return (
        <div className="customer-cluster-container">
          <img
            className="customer-cluster-icon"
            src="/icons/customer-category-icons/active.svg"
          />
          <label className="form-input text-uppercase customer-cluster-label">
            Cliente ativo
          </label>
        </div>
      );
    }
    if (this.state.customer.cluster === 'prospect') {
      return (
        <div className="customer-cluster-container">
          <img
            className="customer-cluster-icon"
            src="/icons/customer-category-icons/prospect.svg"
          />
          <label className="form-input text-uppercase customer-cluster-label">
            Cliente prospect
          </label>
        </div>
      );
    }
  }

  // TODO
  renderCustomerClubChoice() {
    // para shoppings com loyalty
    // cadastrado no clube > exibir categoria
    // nao cadastrado > deseja fazer parte? + enviar termo

    return (
      <Row>
        <Col lg={6} className="club-choice">
          {/* if já-cliente, exibe a categoria abaixo dessa label */}
          <label className="label-input form-input already-client">
            Cliente já faz parte do clube
          </label>

          {/* if não-cliente, exibe isso */}
          <label className="label-input club-desire form-input active">
            Deseja fazer parte do clube?
          </label>
          <Row className="radio-buttons-container">
            <Col
              lg={3}
              className="radio-button-container"
              id="club-desire-choice"
            >
              <label className="checkbox">
                <input
                  type="radio"
                  name="club-desire"
                  value="yes"
                  onChange={this.handleClubChoice}
                />
                <span className="checkmark" />
                <span className="radio-label-text">Sim</span>
              </label>
            </Col>

            <Col lg={3} className="radio-button-container">
              <label className="checkbox">
                <input
                  type="radio"
                  name="club-desire"
                  value="no"
                  onChange={this.handleClubChoice}
                />
                <span className="checkmark" />
                <span className="radio-label-text">Não</span>
              </label>
            </Col>
          </Row>

          {/* só é exibido se o cliente marcar que deseja participar do clube */}
          <Col lg={6} className="club-contract">
            <label className="label-input form-input">
              Enviar termo de aceitação
            </label>
            <select defaultValue="DEFAULT">
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              <option value="email">E-mail</option>
              <option value="sms">SMS</option>
            </select>
          </Col>
        </Col>
      </Row>
    );
  }

  renderVehicleToggleSwitch() {
    if (this.state.locationId === PARKING_LOCATION_ID) {
      return (
        <Row>
          <Col className="vehicle-toggle-switch" md={{ span: 3, offset: 9 }}>
            <label className="text-uppercase toggle-switch-label">
              Inserir dados do veículo
            </label>
            <span className="switch switch-sm">
              <input
                type="checkbox"
                className="switch"
                id="switch-sm"
                checked={this.state.vehicleSwitch}
                onChange={this.handleToggleSwitch}
              />
              <label htmlFor="switch-sm" />
            </span>
          </Col>
        </Row>
      );
    }
    if (this.state.vehicleToggle) {
      this.setState({ vehicleToggle: false, vehicleSwitch: false });
    }
  }

  renderVehicleFields() {
    if (this.state.vehicleToggle) {
      return (
        <Row className="input-fields-container vehicle-data">
          <Row lg={12} md={12}>
            <Col lg={6} md={6}>
              <span className="input-group-title">Dados do veículo</span>
            </Col>
          </Row>

          <Row>
            <Col lg={3} md={3}>
              <label className="label-input form-input">Veículo*</label>
              <input
                type="text"
                className={this.fields.vehicle.type.error}
                name="vehicle"
                maxLength="50"
                value={this.state.vehicle.type}
                data-field="vehicle.type"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3} md={3}>
              <label className="label-input form-input">Marca*</label>
              <input
                type="text"
                className={this.fields.vehicle.brand.error}
                name="brand"
                maxLength="20"
                value={this.state.vehicle.brand}
                data-field="vehicle.brand"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6} md={6}>
              <label className="label-input form-input">Nome do condutor</label>
              <input
                type="text"
                name="driverName"
                maxLength="50"
                value={this.state.vehicle.driverName}
                data-field="vehicle.driverName"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Placa*</label>
              <input
                type="text"
                className={this.fields.vehicle.licensePlate.error}
                name="licensePlate"
                maxLength="10"
                value={this.state.vehicle.licensePlate}
                data-field="vehicle.licensePlate"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">Cor</label>
              <input
                type="text"
                name="color"
                maxLength="50"
                value={this.state.vehicle.color}
                data-field="vehicle.color"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={3}>
              <label className="label-input form-input">Chassi</label>
              <input
                type="text"
                name="chassis"
                maxLength="30"
                value={this.state.vehicle.chassis}
                data-field="vehicle.chassis"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">RENAVAM</label>
              <input
                type="text"
                name="renavam"
                maxLength="15"
                value={this.state.vehicle.renavam}
                data-field="vehicle.renavam"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Ano</label>
              <input
                type="text"
                name="year"
                maxLength="6"
                value={this.state.vehicle.year}
                data-field="vehicle.year"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">
                Local da ocorrência
              </label>
              <input
                type="text"
                name="ocurrenceLocation"
                maxLength="100"
                value={this.state.vehicle.ocurrenceLocation}
                data-field="vehicle.ocurrenceLocation"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6}>
              <label className="label-input form-input">
                Ticket/Meio de pagamento automático
              </label>
              <input
                type="text"
                name="paymentTicket"
                maxLength="20"
                value={this.state.vehicle.paymentTicket}
                data-field="vehicle.paymentTicket"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Cidade</label>
              <input
                type="text"
                name="city"
                maxLength="25"
                value={this.state.vehicle.city}
                data-field="vehicle.city"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">UF</label>
              <input
                type="text"
                name="state"
                maxLength="2"
                value={this.state.vehicle.state}
                data-field="vehicle.state"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6}>
              <label className="label-input form-input">
                Comprovante do seguro
              </label>
              <input
                type="text"
                name="insuranceProof"
                maxLength="50"
                value={this.state.vehicle.insuranceProof}
                data-field="vehicle.insuranceProof"
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Row>
      );
    }
  }

  renderTipoAtendimento() {
    return (
      <Col lg={3} md={3} xs={12}>
        <label className="label-input">Tipo de atendimento*</label>
        <select
          onChange={this.handleChange}
          data-field="types"
          defaultValue="DEFAULT"
        >
          <option value="DEFAULT" disabled>
            -- Selecione --
          </option>
          {this.fields.types.options.map(supType => (
            <option value={supType.type} key={supType.type}>
              {supType.name}
            </option>
          ))}
        </select>
      </Col>
    );
  }

  renderCanalAtendimento() {
    return (
      <Col className="support-channels" lg={6} md={6} xs={12}>
        <Row>
          <label className="label-input">Canal de atendimento*</label>
        </Row>
        <Row
          className={`radio-button-container ${this.fields.ticket.channelId.error}`}
        >
          {this.fields.channels.options.map(option => (
            <Col lg={3} className="radio-buttons-container" key={option.id}>
              <label className="checkbox">
                <input
                  type="radio"
                  name="service-channel"
                  value={option.id}
                  data-field="channels"
                  onChange={this.handleChange}
                />
                <span className="checkmark" />
                <span className="radio-label-text">{option.name}</span>
              </label>
            </Col>
          ))}
        </Row>
      </Col>
    );
  }

  render() {
    return (
      <section className="content">
        <form style={{ flex: 1 }}>
          <Row lg={12} className="mall-and-support">
            <Col lg={3} md={3} xs={12}>
              <label className="label-input">Shopping*</label>
              <select
                data-field="mallId"
                onChange={this.handleChange}
                value={this.state.mallId}
              >
                {this.state.malls ? (
                  this.state.malls.map(mall => (
                    <option value={mall.id} key={mall.id}>
                      {mall.name}
                    </option>
                  ))
                ) : (
                  <option>Loading</option>
                )}
              </select>
            </Col>

            {/* Tipo Atendimento */}
            {this.renderTipoAtendimento()}

            {/* CanalAtendimento */}
            {this.renderCanalAtendimento()}
          </Row>

          {/* Campos de ocorrência */}
          {this.renderOccurrenceFields()}

          {/* Campo menor de descrição para atendimentos rápidos  */}
          {this.renderShortDescriptionField()}

          <Row className="button-disclaimer-row">
            <Col className="input-fields-container">
              <span className="span-fields-required">*Campos obrigatórios</span>
              <button
                className="button-default -action -small align-center"
                onClick={this.sendTicket}
              >
                Salvar
              </button>
            </Col>
          </Row>
        </form>
      </section>
    );
  }
}

export default SAC;
