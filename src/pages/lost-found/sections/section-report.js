import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { DateRangePicker } from 'react-dates';
import { Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';
import moment from 'moment-timezone';

import MyChart from '../../../components/my-charts';
import ChartStacked from '../../../components/my-charts/stacked-column';
import ChartLine from '../../../components/my-charts/line';
import ChartPie from '../../../components/my-charts/pie';
import { getDayOfWeek } from '../../../utils/functions';
import LostFoundStatistcs from '../components/lostfound-statistcs';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';

const api = new ApiClient();

const Report = () => {
  const searchButtonRef = useRef(null);

  const { mallId, setMallId } = useMall();
  const { malls } = useSession();

  const [totalRegistersByWeekDay, setTotalRegistersByWeekDay] = useState(null);
  const [notWithdrawnItens, setNotWithdrawnItens] = useState(null);
  const [mostFoundItems, setMostFoundItems] = useState(null);
  const [statistcs, setStatistics] = useState(null);

  const [startDate, setStartDate] = useState(moment.utc());
  const [endDate, setEndDate] = useState(moment.utc());

  const [focusedInput, setFocusedInput] = useState();

  const [itemTypeSelected, setItemTypeSelected] = useState('all');
  const [itemTypes, setItemTypes] = useState([]);

  useEffect(() => {
    if (mallId) {
      api
        .getLostFoundItem(mallId)
        .then(data => setItemTypes(data.filter(item => item.original)))
        .catch(() => setItemTypes([]));
    }
  }, [mallId]);

  useEffect(() => {
    searchButtonRef.current.click();
  }, []);

  const loadGraphs = useCallback(
    async (_mallId, _period, _itemTypeSelected) => {
      let itemType = null;
      if (_itemTypeSelected !== 'all') {
        itemType = _itemTypeSelected;
      }

      const prepareDataForReisterByWeekDay = async () => {
        const data = await api.getLostFoundAverageWeeklyUsage(
          _mallId,
          _period,
          itemType
        );
        return data.map(obj => ({
          ...obj,
          weekDay: getDayOfWeek(obj.weekDay),
        }));
      };

      setTotalRegistersByWeekDay(prepareDataForReisterByWeekDay());

      setNotWithdrawnItens(
        api.getLostFoundNotWithdrawnItems(_mallId, _period, itemType)
      );

      setMostFoundItems(
        api.getLostFoundMostLostItems(_mallId, _period, itemType)
      );
      setStatistics(
        api.getLostFoundBasicsStatistics(_mallId, _period, itemType)
      );
    },
    []
  );

  const handleMallChange = useCallback(event => setMallId(event.target.value), [
    setMallId,
  ]);

  const handleChangeItemType = useCallback(
    event => setItemTypeSelected(event.target.value),
    []
  );

  const handleExtractPeriodChange = useCallback(
    ({ startDate: start, endDate: end }) => {
      setStartDate(start);
      setEndDate(end);
    },
    []
  );

  const handleSearchClick = useCallback(
    event => {
      event.preventDefault();
      loadGraphs(
        mallId,
        {
          startDate: format(startDate.toDate(), 'yyyy-MM-dd'),
          endDate: format(endDate.toDate(), 'yyyy-MM-dd'),
        },
        itemTypeSelected
      );
    },
    [endDate, itemTypeSelected, loadGraphs, mallId, startDate]
  );

  const ChartTotalRegistersByWeekDay = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartStacked}
        dataPromise={totalRegistersByWeekDay}
        id="lost-found-total-registers-by-weekday"
        title="MÉDIA DE ATENDIMENTOS POR DIA DA SEMANA"
        layout={{
          height: 400,
          columnSeries: {
            percentWidth: 25,
          },
        }}
        category="weekDay"
      />
    ),
    [totalRegistersByWeekDay]
  );

  const ChartLineChart = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartLine}
        dataPromise={notWithdrawnItens}
        id="lost-found-not-withdrawn-itens"
        title="ITENS NÃO RETIRADOS"
        layout={{ height: 520 }}
        category="day"
      />
    ),
    [notWithdrawnItens]
  );

  const ChartMostFoundItems = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartPie}
        dataPromise={mostFoundItems}
        id="lost-found-most-found-item"
        title="ITENS MAIS PERDIDOS"
        layout={{
          height: 400,
        }}
        category="itemName"
        valueY="total"
      />
    ),
    [mostFoundItems]
  );

  const ChartStatistcs = useMemo(() => {
    return (
      <MyChart
        ChartComponent={LostFoundStatistcs}
        dataPromise={statistcs}
        layout={{ height: 400 }}
        am4chartMenu={false}
        id="lostfound-statistcs"
      />
    );
  }, [statistcs]);

  return (
    <>
      <Row className="loan-report-menu">
        <Col md={3}>
          <label className="label-input text-uppercase">Shopping</label>
          <select
            data-field="mallId"
            onChange={handleMallChange}
            className={mallId && malls.length > 1 ? '-selected' : ''}
            defaultValue={mallId || 'DEFAULT'}
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
        </Col>
        <Col md={3}>
          <label className="label-input text-uppercase">ITEM</label>
          <select
            defaultValue="all"
            onChange={handleChangeItemType}
            className="-selected"
          >
            <option value="all">TODOS</option>
            {itemTypes &&
              itemTypes.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
          </select>
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
              onFocusChange={input => setFocusedInput(input)}
              displayFormat={() => 'DD/MM/YYYY'}
              isOutsideRange={() => {}}
              customArrowIcon=" "
              startDatePlaceholderText="início"
              endDatePlaceholderText="fim"
              required
            />
          </div>
        </Col>
        <Col md={1}>
          <button
            ref={searchButtonRef}
            className="button-default -small"
            onClick={handleSearchClick}
          >
            BUSCAR
          </button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={2} className="pt-4">
          {ChartStatistcs}
        </Col>
        <Col xs={12} lg={4} className="pt-4">
          {ChartMostFoundItems}
        </Col>
        <Col xs={12} lg={6} className="pt-4">
          {ChartTotalRegistersByWeekDay}
        </Col>
        <Col xs={12} className="pt-4">
          {ChartLineChart}
        </Col>
      </Row>
    </>
  );
};

export default Report;
