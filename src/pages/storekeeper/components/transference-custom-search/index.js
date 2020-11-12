import React, { useCallback, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FiSearch } from 'react-icons/fi';
import { Row, Col } from 'react-bootstrap';

import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

const CustomSearchRender = ({ searchText, onSearch, onDateChange }) => {
  const [chooseDate, setChooseDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const handleDateChange = useCallback(
    event => {
      event.preventDefault();
      const { value } = event.target;
      setChooseDate(value);
      onDateChange(value);
    },
    [onDateChange]
  );

  const handleTextChange = useCallback(
    event => {
      onSearch(event.target.value);
    },
    [onSearch]
  );

  const dates = useMemo(() => {
    const monthList = Array.from({ length: 12 }, (_, index) => {
      const newDate = addMonths(new Date(), -index);
      return {
        date: format(newDate, 'yyyy-MM-dd'),
        name: format(newDate, 'MMMM / yyyy', { locale: ptBR }),
      };
    });
    return monthList;
  }, []);

  return (
    <div>
      <Row>
        <Col xs={12} md="auto">
          <div>
            <label className="label-input text-uppercase">Mês</label>
            <select
              data-field="month"
              onChange={handleDateChange}
              value={chooseDate}
              className=" -selected"
            >
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              {dates ? (
                dates.map(d => (
                  <option value={d.date} key={d.name}>
                    {d.name}
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
        <Col xs={12} md={6}>
          <label className="label-input text-uppercase">Pesquisar</label>
          <div className="custom-search-input">
            <input
              type="text"
              className="searchCoalition"
              name="zipCode"
              label="Pesquisa de Beneficios"
              value={searchText || ''}
              placeholder="Nome do Banco, Conta, Data..."
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
