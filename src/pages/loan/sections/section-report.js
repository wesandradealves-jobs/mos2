import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';

import MyChart from '../../../components/my-charts';
import ChartStacked from '../../../components/my-charts/stacked-column';
import ChartGroupedSorted from '../../../components/my-charts/grouped-and-sorted';
import ChartHeatMap from '../../../components/my-charts/heat-map';

import LoanStatistcs from '../components/loan-statistcs';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';

const api = new ApiClient();

const Report = () => {
  const { mallId, setMallId } = useMall();
  const { malls } = useSession();

  const [totalLoansByDayGrouped, setTotalLoansByDayGrouped] = useState(null);
  const [totalLoansByDayStacked, setTotalLoansByDayStacked] = useState(null);
  const [usagePerPeriod, setUsagePerPeriod] = useState(null);
  const [averageLoanTime, setAverageLoanTime] = useState(null);
  const [statistcs, setStatistics] = useState(null);

  const [period, setPeriod] = useState('day');

  const [itemTypeSelected, setItemTypeSelected] = useState('all');
  const [itemTypes, setItemTypes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const types = await api.getLoanItemTypes(mallId);
      setItemTypes(types);
    };
    load();
  }, [mallId]);

  const loadGraphs = useCallback((_mallId, _period, _itemTypeSelected) => {
    let itemType = null;
    if (_itemTypeSelected !== 'all') {
      itemType = _itemTypeSelected;
    }

    setTotalLoansByDayStacked(
      api.getTotalLoansByDay(_mallId, _period, 'stacked', itemType)
    );
    setTotalLoansByDayGrouped(
      api.getTotalLoansByDay(_mallId, _period, 'grouped-sorted', itemType)
    );
    setUsagePerPeriod(api.getUsagePerPeriod(_mallId, _period, itemType));
    setAverageLoanTime(api.getAverageLoanTime(_mallId, _period, itemType));
    setStatistics(api.getLoanStatistics(_mallId, _period, itemType));
  }, []);

  useEffect(() => {
    loadGraphs(mallId, 'today', 'all');
  }, [loadGraphs, mallId]);

  const handleMallChange = useCallback(
    event => {
      setMallId(event.target.value);
    },
    [setMallId]
  );

  const handleChangeItemType = useCallback(event => {
    setItemTypeSelected(event.target.value);
  }, []);

  const handlePeriodChange = useCallback(event => {
    setPeriod(event.target.value);
  }, []);

  const handleSearchClick = useCallback(
    event => {
      event.preventDefault();
      loadGraphs(mallId, period, itemTypeSelected);
    },
    [itemTypeSelected, loadGraphs, mallId, period]
  );

  const ChartTotalLoansByDayGrouped = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartGroupedSorted}
        dataPromise={totalLoansByDayGrouped}
        id="total-loans-by-day-grouped"
        title="ITENS POR DIA"
        layout={{
          height: 420,
          columnSeries: {
            percentWidth: 80,
          },
        }}
        category="data"
        valueY={{ property: 'quantity', name: 'Quantidade' }}
      />
    ),
    [totalLoansByDayGrouped]
  );

  const ChartTotalLoansByDayStacked = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartStacked}
        dataPromise={totalLoansByDayStacked}
        id="total-loans-by-day-stacked"
        title="TOTAL DE EMPRÉSTIMOS POR ITEM"
        layout={{
          height: 520,
          columnSeries: {
            percentWidth: 25,
          },
        }}
        category="data"
      />
    ),
    [totalLoansByDayStacked]
  );

  const ChartAverageLoanTime = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartStacked}
        dataPromise={averageLoanTime}
        id="average-loan-time-stacked"
        title="PERMANÊNCIA MÉDIA POR ITEM"
        layout={{
          height: 360,
          columnSeries: {
            percentWidth: 25,
          },
          tooltip: {
            getTooltipText: value => {
              const hours = Math.trunc(value / 60);
              const minutes = value - 60 * hours;
              return `${hours && `${hours} h`} ${minutes} min`;
            },
          },
        }}
        category="data"
      />
    ),
    [averageLoanTime]
  );

  const ChartUsagePerPeriod = useMemo(
    () => (
      <MyChart
        ChartComponent={ChartHeatMap}
        dataPromise={usagePerPeriod}
        id="loan-usage-per-period"
        title="USO DE ITENS/PERIODO"
        layout={{ height: 360 }}
      />
    ),
    [usagePerPeriod]
  );

  const ChartStatistcs = useMemo(() => {
    return (
      <MyChart
        ChartComponent={LoanStatistcs}
        dataPromise={statistcs}
        layout={{ height: 520 }}
        am4chartMenu={false}
        id="loan-statistcs"
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
          <label className="label-input text-uppercase">ITEM EMPRESTADO</label>
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
        <Col md={3}>
          <label className="label-input text-uppercase">PERÍODO</label>
          <select
            defaultValue="today"
            onChange={handlePeriodChange}
            className="-selected"
          >
            <option value="today">Hoje</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
            <option value="year">Ano</option>
          </select>
        </Col>
        <Col md={1}>
          <button className="button-default -small" onClick={handleSearchClick}>
            BUSCAR
          </button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="pt-4">
          {ChartTotalLoansByDayGrouped}
        </Col>
        <Col xs={12} lg={8} className="pt-4">
          {ChartTotalLoansByDayStacked}
        </Col>
        <Col xs={12} lg={4} className="pt-4">
          {ChartStatistcs}
        </Col>
        <Col xs={12} lg={6} className="pt-4">
          {ChartUsagePerPeriod}
        </Col>
        <Col xs={12} lg={6} className="pt-4">
          {ChartAverageLoanTime}
        </Col>
      </Row>
    </>
  );
};

export default Report;
