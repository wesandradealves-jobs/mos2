import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Row, Col } from 'react-bootstrap';
import ApiClient from '../../services/api';

const defaultSearchStyles = theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
});

class CustomSearchRender extends React.Component {
  constructor(props) {
    super(props);

    this.client = new ApiClient();
    console.log(props.malls);
    this.state = {
      mallId: 8,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = event => {
    if (event.keyCode === 27) {
      const { onHide } = this.props;
      onHide();
    }
  };

  async getTicketTypes() {
    const response = await this.client.getData('types');
    const types = response.map(type => (
      <option value={type.type} key={type.type}>
        {type.name}
      </option>
    ));

    return types;
  }

  handleMallChange = event => {
    event.preventDefault();
    const { value } = event.target;
    this.setState({ mallId: value }, () => {
      const { onMallChange } = this.props;
      onMallChange(value);
    });
  };

  handleTextChange = event => {
    const { onSearch } = this.props;
    onSearch(event.target.value);
  };

  renderSacSearch() {
    const { searchText, malls } = this.props;
    const { mallId } = this.state;
    return (
      <div>
        <Row lg={12}>
          <Col lg={4} md={4} xs={12}>
            <div>
              <label className="label-input text-uppercase">Shopping</label>
              <select
                data-field="mallId"
                onChange={this.handleMallChange}
                value={mallId}
              >
                {malls ? (
                  malls.map(mall => (
                    <option value={mall.id} key={mall.id}>
                      {mall.name}
                    </option>
                  ))
                ) : (
                  <option>Loading</option>
                )}
              </select>
            </div>
          </Col>
          <Col lg={6} md={6} xs={12}>
            <div ref={el => (this.rootRef = el)}>
              <label className="label-input text-uppercase">Pesquisar</label>
              <input
                type="text"
                name="zipCode"
                label="Pesquisa Atendimento"
                value={searchText || ''}
                placeholder="Nome, CPF ou número da ocorrência"
                onChange={this.handleTextChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderEditionSearch() {
    const { searchText } = this.props;
    return (
      <div>
        <Row lg={12}>
          <Col lg={4} md={4} xs={12}>
            <div>
              <label className="label-input text-uppercase">Shopping</label>
              <select
                defaultValue=""
                data-field="mallId"
                onChange={this.handleMallChange}
              >
                <option value="" disabled>
                  {' '}
                  -- Selecione --
                </option>
                <option value="1">Plaza</option>
                <option value="2">Barbacena</option>
                <option value="3">Teste</option>
              </select>
            </div>
          </Col>
          <Col lg={4} md={4} xs={12}>
            <div>
              <label className="label-input text-uppercase">Editar</label>
              <select
                defaultValue=""
                data-field="mallId"
                onChange={this.handleMallChange}
              >
                <option value="" disabled>
                  -- Selecione --
                </option>
                <option value="1">powerbank</option>
                <option value="2">Carrinho de bebê</option>
                <option value="3">Cadeira de rodas</option>
              </select>
            </div>
          </Col>
          <Col lg={3} md={3} xs={12}>
            <div ref={el => (this.rootRef = el)}>
              <label className="label-input text-uppercase">Pesquisar</label>
              <input
                type="text"
                name="zipCode"
                label="Pesquisa Atendimento"
                value={searchText || ''}
                placeholder="Nome, CPF ou número da ocorrência"
                onChange={this.handleTextChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderControlSearch() {
    const { searchText } = this.props;
    return (
      <div>
        <Row lg={12}>
          <Col lg={4} md={4} xs={12}>
            <div>
              <label className="label-input text-uppercase">Item</label>
              <select
                defaultValue=""
                data-field="mallId"
                onChange={this.handleMallChange}
              >
                <option value="" disabled>
                  -- Selecione --
                </option>
                <option value="1">Carrinho de bebê</option>
                <option value="2">Cadeira de rodas</option>
              </select>
            </div>
          </Col>
          <Col lg={6} md={6} xs={12}>
            <div ref={el => (this.rootRef = el)}>
              <label className="label-input text-uppercase">Pesquisar</label>
              <input
                type="text"
                name="zipCode"
                label="Pesquisa Atendimento"
                value={searchText || ''}
                placeholder="data, código, nome do cliente"
                onChange={this.handleTextChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { renderType } = this.props;

    if (renderType === 'control') {
      return this.renderControlSearch();
    }

    if (renderType === 'edition') {
      return this.renderEditionSearch();
    }

    return this.renderSacSearch();
  }
}

export default withStyles(defaultSearchStyles, { name: 'CustomSearchRender' })(
  CustomSearchRender
);
