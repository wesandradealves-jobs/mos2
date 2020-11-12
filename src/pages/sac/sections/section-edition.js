import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import _ from 'lodash';
import ApiClient from '../../../services/api';
import { bindAll } from '../../../utils/functions';
import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../../utils/masks';

import FileSelector from '../../../components/fileselector';
import { ReactComponent as PrintIcon } from '../../../img/table/print.svg';

const PARKING_LOCATION_ID = 16;

class EditionModeSAC extends React.Component {
  constructor(props) {
    super(props);

    this.environment = 'dev';
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
        fullName: { required: true },
        cpf: {
          required: true,
          group: 'customer',
          filter: cpf => cpf.replace(/\D/g, ''),
          onChange: 'getCustomerData',
        },
        zipCode: { required: true, filter: cep => cep.replace(/\D/g, '') },
        sex: { required: true },
        birthday: { required: true },
        email: { required: true },
        mobileNumber: {
          required: true,
          group: 'customer',
          filter: phone => phone.replace(/\D/g, ''),
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
        comment: { type: 'string' },
        statusId: { options: [], type: 'integer' },
        attachmentUri: { options: [] },
        forwardGroups: { options: [], type: 'integer' },
        location: { options: [], type: 'string' },
      },
      vehicle: {
        type: { type: 'string' },
        brand: { type: 'string' },
        driverName: { type: 'string' },
        licensePlate: { type: 'string' },
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

    console.log('Session ', this.props.sessionSpot.user.id);
    this.state = {
      activeFields: [],
      maxChars: 100,
      writtenChars: 0,
      mallId: this.props.mallId,
      selectedOptions: '',
      vehicleToggle: false,
      vehicleSwitch: false,
      location: '',
      types: 'ticket',
      employeeId: this.props.sessionSpot.user.id,
      // Propriedades necessárias para mandar o POST de criação de Ticket
      ticket: {
        channelId: 1,
        reasonId: 9999,
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

    bindAll(this, [
      'renderOccurrenceFields',
      'handleForwardGroupChange',
      'handleAttachmentChange',
      'handleAttachmentChange',
      'handleToggleSwitch',
      'handleChange',
      'handleSupportType',
      'handleClubChoice',
      'sendTicket',
      'printTicket',
      'handleKeyPress',
    ]);
  }

  ticketUpdatePopup() {
    this.popUp
      .fire({
        icon: 'success',
        text: `Ocorrência nº ${this.props.ticketId} salva. Deseja imprimir?`,
        showCancelButton: true,
        confirmButtonColor: '#54bbab',
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      })
      .then(result => {
        if (result.value) {
          this.printTicket();
          this.props.handleTab('control');
        } else {
          this.props.handleTab('control');
        }
      });
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

  async handleReasons() {
    const reasonTree = this.state.ticket.reasonTree || '';
    const reasons = reasonTree[0] || [];
    const locations = reasonTree[1] || [];
    const subjects = reasonTree[2] || [];
    const chosenIds = [{ reasonId: 0 }, { locationId: 0 }, { subjectId: 0 }];

    this.fields.reasons.options = reasons;
    this.fields.locations.options = locations;
    this.fields.subjects.options = subjects;

    for (let i = 0; i < reasons.length; i++) {
      if (reasons[i].path === true) {
        chosenIds.reasonId = reasons[i].id;
        this.state.reasonId = chosenIds.reasonId;
        this.state.reason = reasons[i].name;
      }
    }

    for (let i = 0; i < locations.length; i++) {
      if (locations[i].path === true) {
        chosenIds.locationId = locations[i].id;
        this.state.locationId = chosenIds.locationId;
        this.state.location = locations[i].name;
      }
    }

    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].path === true) {
        chosenIds.subjectId = subjects[i].id;
        this.state.subjectId = chosenIds.subjectId;
        this.state.subject = subjects[i].name;
      }
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('D:');
      this.setState(prevState => ({
        pulledTicket: {
          ...prevState.pulledTicket,
          ticket: {
            ...prevState.pulledTicket.ticket,
            comments: prevState.pulledTicket.ticket.comments.push({
              comment: this.state.ticket.newComment,
              employeeName: 'Fulano Fulano',
              dateTime: Date.now(),
              statusId: this.state.statusId,
              statusName: '',
            }),
          },
        },
      }));

      this.setState(prevState => ({
        ticket: {
          ...prevState.ticket,
          newComment: '',
        },
      }));
    }
  }

  async sendTicket(event) {
    event.preventDefault();
    const doNotPrint = false;

    const ticketContent = {
      ticket: {
        reasonId: this.state.subjectId,
        statusId: this.state.ticket.statusId,
        forwardGroupIds: this.state.ticket.forwardGroupIds,
        comment: this.state.ticket.comment,
        employeeId: this.state.employeeId,
      },
      customer: {
        mobileNumber: this.state.customer.mobileNumber,
        fullName: this.state.customer.fullName,
        sex: this.state.customer.sex,
        birthday: this.state.customer.birthday,
        zipCode: this.state.customer.zipCode,
        email: this.state.customer.email,
      },
    };

    this.client
      .patchTicket(this.props.ticketId, this.state.mallId, ticketContent)
      .then(ticketId => this.ticketUpdatePopup(doNotPrint, ticketId))
      .catch(err => console.error(err));
  }

  convertISOToShortDate(date) {
    let shortDate;
    const dateObject = new Date(date);
    return (shortDate = `${dateObject.getDate()}/${dateObject.getMonth()}/${dateObject.getFullYear()}`);
  }

  async componentDidMount() {
    // this.setState({});
    const { ticketId } = this.props;
    let pulledTicket;

    try {
      this.getApiData('reasons', 'reasons');
      this.getApiData('channels', 'channels');
      this.getApiData('status', 'ticket.statusId');
      this.getApiData('types', 'types');
      this.getApiData('forward-groups', 'ticket.forwardGroups');
      pulledTicket = await this.client.getTicket(ticketId, this.state.mallId);
    } catch (e) {
      console.error('Error pulling data', e);
      return e;
    }
    this.setState({
      pulledTicket,
      customer: {
        ...pulledTicket.customer,
      },
      ticket: {
        ...pulledTicket.ticket,
        firstComment: pulledTicket.ticket.comments[0].comment,
      },
      vehicleToggle: !!pulledTicket.vehicle,
    });
    await this.handleReasons();
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

    if (url) {
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
      this.setState({ vehicleToggle: true });
    } else {
      this.setState({ vehicleToggle: false });
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

  async printTicket() {
    const response = await this.client.printTicket(
      this.props.ticketId,
      this.state.mallId
    );
    const retrievedPDF = new Blob([response.data], {
      type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(retrievedPDF);
    window.open(url);
  }

  renderStatusField() {
    let statusClass = '';
    let statusLabel = '';

    if (this.state.pulledTicket) {
      if (this.state.pulledTicket.ticket.statusId === 1) {
        statusClass = 'on-going';
        statusLabel = 'Em Andamento';
      } else if (this.state.pulledTicket.ticket.statusId === 2) {
        statusClass = 'concluded';
        statusLabel = 'Concluído';
      } else if (this.state.pulledTicket.ticket.statusId === 3) {
        statusClass = 'finished';
        statusLabel = 'Encerrada';
      }
    }

    return (
      <div className="status-box-container">
        <span className="label-input status-label">STATUS</span>
        <span className={`status-box ${statusClass}`}>{statusLabel}</span>
      </div>
    );
  }

  renderTicketComments() {
    if (this.state.ticket.comments) {
      return this.state.ticket.comments.map(comment => (
        <div className="ticket-comment">
          <label className="ticket-history-user">
            <figure className="image">
              <span className="ticket-history-user-initials">
                {comment.employeeName.split(' ').map(n => n[0])}
              </span>
            </figure>
          </label>
          <div className="ticket-comment-content">
            <div>
              <span className="text-uppercase label-input ticket-history-user-name">
                {comment.employeeName}
              </span>
              <span className="comment-datetime">
                {this.convertISOToShortDate(comment.dateTime)}
              </span>
            </div>

            <div>{comment.comment}</div>
          </div>
        </div>
      ));
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
                onChange={this.handleDescriptionCharsChange.bind(this)}
                wrap="off"
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
                disabled
                mask={cpfMask}
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
                disabled
                mask={cepMask}
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
                disabled
                defaultValue="DEFAULT"
                data-field="reasons"
                onChange={this.handleChange}
                value={this.state.reasonId}
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
                disabled
                type="text"
                value={this.state.customer.fullName}
                data-field="customer.fullName"
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <label className="label-input form-input">Local*</label>
              <select
                disabled
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
                <option value="7">Estacionamentos</option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col lg={3}>
              <label className="label-input form-input">Gênero*</label>
              <select
                disabled
                value={this.state.customer.sex}
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
                disabled
                type="date"
                value={this.state.customer.birthday}
                data-field="customer.birthday"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={6}>
              <label className="label-input form-input">Assunto*</label>
              <select
                disabled
                defaultValue="DEFAULT"
                data-field="subjects"
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

                <option value="3" key="vehicle-test">
                  Vehicle test
                </option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col lg={3}>
              <label className="label-input form-input">E-mail*</label>
              <input
                disabled
                type="text"
                value={this.state.customer.email}
                data-field="customer.email"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">Telefone*</label>
              <MaskedInput
                disabled
                mask={phoneMask}
                type="text"
                name="customerPhone"
                value={this.state.customer.mobileNumber}
                data-field="customer.mobileNumber"
                onChange={this.handleChange}
              />
            </Col>

            <Col className="attachment-container-edition-mode" lg={6}>
              <label className="label-input form-input">Anexar</label>
              <FileSelector
                disabled
                name="arquivo"
                data-field="ticket.attachmentUri"
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
                    value={this.state.ticket.statusId}
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
                  disabled
                  cols="200"
                  rows="6"
                  maxLength="5000"
                  value={this.state.ticket.firstComment}
                  onChange={this.handleChange}
                  data-field="firstComment"
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
            src="/icons/customer-category-icons/active-customer.svg"
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
            src="/icons/customer-category-icons/prospect-customer.svg"
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
    if (this.state.locationId === 7) {
      return (
        <Row>
          <Col className="vehicle-toggle-switch" md={{ span: 3, offset: 9 }}>
            <label className="text-uppercase toggle-switch-label">
              Inserir dados do veículo
            </label>
            <span className="switch switch-sm">
              <input
                disabled
                type="checkbox"
                className="switch"
                id="switch-sm"
                onChange={this.handleToggleSwitch}
              />
              <label htmlFor="switch-sm" />
            </span>
          </Col>
        </Row>
      );
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
                disabled
                type="text"
                name="vehicle"
                maxLength="50"
                value={this.state.pulledTicket.vehicle.type}
                data-field="vehicle.type"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3} md={3}>
              <label className="label-input form-input">Marca*</label>
              <input
                disabled
                type="text"
                name="brand"
                maxLength="20"
                value={this.state.pulledTicket.vehicle.brand}
                data-field="vehicle.brand"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6} md={6}>
              <label className="label-input form-input">Nome do condutor</label>
              <input
                disabled
                type="text"
                name="driverName"
                maxLength="50"
                value={this.state.pulledTicket.vehicle.driverName}
                data-field="vehicle.driverName"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Placa*</label>
              <input
                disabled
                type="text"
                name="licensePlate"
                maxLength="10"
                value={this.state.pulledTicket.vehicle.licensePlate}
                data-field="vehicle.licensePlate"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">Cor</label>
              <input
                disabled
                type="text"
                name="color"
                maxLength="50"
                value={this.state.pulledTicket.vehicle.color}
                data-field="vehicle.color"
                onChange={this.handleChange}
              />
            </Col>

            <Col lg={3}>
              <label className="label-input form-input">Chassi</label>
              <input
                disabled
                type="text"
                name="chassis"
                maxLength="30"
                value={this.state.pulledTicket.vehicle.chassis}
                data-field="vehicle.chassis"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">RENAVAM</label>
              <input
                disabled
                type="text"
                name="renavam"
                maxLength="15"
                value={this.state.pulledTicket.vehicle.renavam}
                data-field="vehicle.renavam"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Ano</label>
              <input
                disabled
                type="text"
                name="year"
                maxLength="6"
                value={this.state.pulledTicket.vehicle.year}
                data-field="vehicle.year"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">
                Local da ocorrência
              </label>
              <input
                disabled
                type="text"
                name="ocurrenceLocation"
                maxLength="100"
                value={this.state.pulledTicket.vehicle.ocurrenceLocation}
                data-field="vehicle.ocurrenceLocation"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6}>
              <label className="label-input form-input">
                Ticket/Meio de pagamento automático
              </label>
              <input
                disabled
                type="text"
                name="paymentTicket"
                maxLength="20"
                value={this.state.pulledTicket.vehicle.paymentTicket}
                data-field="vehicle.paymentTicket"
                onChange={this.handleChange}
              />
            </Col>
          </Row>

          <Row lg={12}>
            <Col lg={3}>
              <label className="label-input form-input">Cidade</label>
              <input
                disabled
                type="text"
                name="city"
                maxLength="25"
                value={this.state.pulledTicket.vehicle.city}
                data-field="vehicle.city"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={3}>
              <label className="label-input form-input">UF</label>
              <input
                disabled
                type="text"
                name="state"
                maxLength="2"
                value={this.state.pulledTicket.vehicle.state}
                data-field="vehicle.state"
                onChange={this.handleChange}
              />
            </Col>
            <Col lg={6}>
              <label className="label-input form-input">
                Comprovante do seguro
              </label>
              <input
                disabled
                type="text"
                name="insuranceProof"
                maxLength="50"
                value={this.state.pulledTicket.vehicle.insuranceProof}
                data-field="vehicle.insuranceProof"
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Row>
      );
    }
  }

  render() {
    return (
      <section className="content">
        <div className="form-header">
          <Row className="ticket-number-container">
            <Col lg={5} md={5}>
              <div className="breadcrumbs-header">
                <span className="text-uppercase form-input breadcrumbs-parts">
                  {this.state.reason} >{' '}
                </span>
                <span className="text-uppercase form-input breadcrumbs-parts">
                  {this.state.location} >{' '}
                </span>
                <span className="text-uppercase form-input breadcrumbs-parts">
                  {this.state.subject}
                </span>
              </div>
            </Col>
            <Col
              lg={{ span: 3, offset: 4 }}
              md={{ span: 3, offset: 4 }}
              className="ticket-info"
            >
              <span className="ticket-number-label text-uppercase">
                Ocorrência nº{' '}
              </span>
              <span className="ticket-number"> {this.props.ticketId}</span>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>{this.renderStatusField()}</Col>

            <Col lg={{ offset: 6, span: 2 }}>
              <div className="ticket-actions" onClick={this.printTicket}>
                <PrintIcon />
              </div>
            </Col>
          </Row>
        </div>

        <form>
          <Row lg={12} className="mall-and-support">
            <Col lg={3} md={3} xs={12}>
              <label className="label-input">Shopping*</label>
              <select
                disabled
                data-field="mallId"
                onChange={this.handleChange}
                value={this.state.mallId}
              >
                <option value="" disabled>
                  -- Selecione --
                </option>
                <option value="6">Plaza</option>
                <option value="2">Barbacena</option>
                <option value="3">Teste</option>
              </select>
            </Col>

            <Col lg={3} md={3} xs={12}>
              <label className="label-input">Tipo de atendimento*</label>
              <select
                disabled
                onChange={this.handleChange}
                data-field="types"
                defaultValue="ticket"
                value={this.state.types}
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

            <Col className="support-channels" lg={6} md={6} xs={12}>
              <Row>
                <label className="label-input">Canal de atendimento*</label>
              </Row>
              <Row className="radio-buttons-container">
                {this.fields.channels.options.map(option => (
                  <Col
                    lg={3}
                    className="radio-button-container"
                    key={option.id}
                  >
                    <label className="checkbox">
                      <input
                        type="radio"
                        name="service-channel"
                        value={option.id}
                        checked={option.id === this.state.ticket.channelId}
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
          </Row>

          {/* Campos de ocorrência */}
          {this.renderOccurrenceFields()}

          {/* Campo menor de descrição para atendimentos rápidos  */}
          {this.renderShortDescriptionField()}

          <div className="ticket-history-container">
            <div className="text-uppercase ticket-history-title label-input">
              Acompanhamento da ocorrência
            </div>

            {/* <div className="show-ticket-history-label">Carregar acompanhamentos anteriores v</div> */}

            {this.renderTicketComments()}

            <Row className="ticket-history-comment-input">
              <Col className="user-container" lg={1} md={1}>
                <label className="ticket-history-user">
                  <figure className="image">
                    <span className="ticket-history-user-initials">JJ</span>
                    {/* employeeName.split(" ").map((n)=>n[0]) */}
                  </figure>
                </label>
              </Col>
              <Col className="comment-container" lg={11} md={11}>
                <textarea
                  className="new-comment"
                  cols="100"
                  rows="1"
                  maxLength="5000"
                  placeholder="Adicionar acompanhamento..."
                  value={this.state.ticket.comment}
                  onChange={this.handleChange}
                  data-field="ticket.comment"
                  onKeyPress={this.handleKeyPress}
                />
              </Col>
            </Row>
          </div>

          <Row className="button-disclaimer-row">
            <Col className="input-fields-container">
              <span className="obs align-left">*Campos obrigatórios</span>
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

export default EditionModeSAC;
