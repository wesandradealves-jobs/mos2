import React, { useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FiSearch } from 'react-icons/fi';
import { Row, Col } from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';

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

const ExtractCustomSearch = ({
  currentMallId,
  malls,
  searchText,
  onSearch,
  onPeriodChange,
  onMallChange,
}) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [focusedInput, setFocusedInput] = useState();
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

  const handleExtractPeriodChange = useCallback(
    ({ startDate: start, endDate: end }) => {
      setStartDate(start);
      setEndDate(end);

      onPeriodChange({ startDate: start, endDate: end });
    },
    [onPeriodChange]
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
        <Col
          xs={12}
          md="auto"
          className="mt-2 mt-md-0 custom-search-date-range"
        >
          <div>
            <Row>
              <Col id="from">
                <label className="label-input text-uppercase">DE</label>
              </Col>
              <Col id="until">
                <label className="label-input text-uppercase">ATÉ</label>
              </Col>
            </Row>
            <DateRangePicker
              startDate={startDate}
              startDateId="startDateId"
              endDate={endDate}
              endDateId="endDateId"
              onDatesChange={handleExtractPeriodChange}
              focusedInput={focusedInput}
              onFocusChange={input => {
                setFocusedInput(input);
              }}
              displayFormat={() => 'DD/MM/YYYY'}
              isOutsideRange={() => {}}
              customArrowIcon=" "
              startDatePlaceholderText="início"
              endDatePlaceholderText="fim"
              required
            />
          </div>
        </Col>
        <Col xs={12} xl className="mt-2 mt-md-2 mt-xl-0">
          <div>
            <label className="label-input text-uppercase">Pesquisar</label>
            <div className="custom-search-input">
              <input
                type="text"
                name="zipCode"
                label="Pesquisa de Extratos"
                value={searchText || ''}
                placeholder="Detalhe, pontos, responsável ..."
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
  ExtractCustomSearch
);
