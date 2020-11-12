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

const EditionCustomSearch = ({
  currentMallId,
  malls,
  searchText,
  onSearch,
  onMallChange,
}) => {
  const [mallId, setMallId] = useState(currentMallId || malls[0]);

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

  return (
    <div>
      <Row lg={12}>
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
                <option>Loading</option>
              )}
            </select>
          </div>
        </Col>
        <Col xs={12} md className="mt-2 mt-md-auto ">
          <div>
            <label className="label-input text-uppercase">Pesquisar</label>
            <div className="custom-search-input">
              <input
                type="text"
                name="zipCode"
                label="Pesquisa de Beneficios"
                value={searchText || ''}
                placeholder="ID, N° de Patrimônio, Item, Modelo..."
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
  EditionCustomSearch
);
