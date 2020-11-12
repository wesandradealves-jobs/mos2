import React, { useCallback } from 'react';
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

const CustomSearchRender = ({ searchText, onSearch }) => {
  const handleTextChange = useCallback(
    event => {
      onSearch(event.target.value);
    },
    [onSearch]
  );

  return (
    <div>
      <Row>
        <Col>
          <label className="label-input text-uppercase">Pesquisar</label>
          <div className="custom-search-input">
            <input
              type="text"
              className="searchCoalition"
              name="zipCode"
              label="Pesquisa de Beneficios"
              value={searchText || ''}
              placeholder="Data, Nome do Cliente, Descrição..."
              onChange={handleTextChange}
            />
            <FiSearch size={18} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(defaultSearchStyles, { name: 'CustomSearchRender' })(
  CustomSearchRender
);
