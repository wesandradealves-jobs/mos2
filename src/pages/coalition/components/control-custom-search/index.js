import React, { useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FiSearch } from 'react-icons/fi';
import { Row, Col } from 'react-bootstrap';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

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

const ControlCustomSearch = ({
  currentMallId,
  malls,
  searchText,

  onSearch,

  onMallChange,
  onAdvantageChange,
}) => {
  const [mallId, setMallId] = useState(currentMallId || malls[0]);
  const [advantageType, setAdvantageType] = useState('benefits');

  const handleMallChange = useCallback(
    event => {
      event.preventDefault();
      const { value } = event.target;
      setMallId(value);
      onMallChange(value);
    },
    [onMallChange]
  );

  const handleTextChange = useCallback(
    event => {
      onSearch(event.target.value);
    },
    [onSearch]
  );

  const handleAdvantageChange = useCallback(
    event => {
      event.preventDefault();
      const { value } = event.target;
      setAdvantageType(value);
      onAdvantageChange(value);
    },
    [onAdvantageChange]
  );

  return (
    <div>
      <Row>
        <Col xs={12} md="auto">
          <div>
            <label className="label-input text-uppercase">Shopping</label>
            <select
              data-field="mallId"
              onChange={handleMallChange}
              value={mallId || 'DEFAULT'}
              className={`${mallId && malls.length > 1 && ' -selected'}`}
              disabled={malls.length === 1}
            >
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              {malls ? (
                malls.map(mall => (
                  <option value={mall.id} key={mall.id}>
                    {mall.name}
                  </option>
                ))
              ) : (
                <>
                  <option>Carregando</option>
                </>
              )}
            </select>
          </div>
        </Col>
        <Col xs={12} md="auto">
          <div>
            <label className="label-input text-uppercase">
              Tipos de Vantagem
            </label>
            <select
              value={advantageType}
              onChange={handleAdvantageChange}
              className={`${advantageType && ' -selected'}`}
            >
              <option value="benefits">Benefícios</option>
              <option value="tags">Multiplicador de Pontos </option>
            </select>
          </div>
        </Col>
        <Col xs={12} md>
          <div>
            <label className="label-input text-uppercase">Pesquisar</label>
            <div className="custom-search-input">
              <input
                type="text"
                name="zipCode"
                label="Pesquisa de Extratos"
                value={searchText || ''}
                placeholder={
                  advantageType === 'benefits'
                    ? 'Nome do benefício, pontos...'
                    : 'Nome do multiplicador, valor...'
                }
                onChange={handleTextChange}
              />
              <FiSearch size={18} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(defaultSearchStyles, { name: 'CustomSearchRender' })(
  ControlCustomSearch
);
