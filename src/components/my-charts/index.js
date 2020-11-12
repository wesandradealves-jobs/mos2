/* eslint-disable new-cap */
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import Spinner from '../spinner';
import Menu from './menu';

const Chart = ({
  ChartComponent,
  dataPromise,
  title,
  am4chartMenu = true,
  ...restProps
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const graphPrintRef = useRef();

  useEffect(() => {
    setLoading(true);
    dataPromise && dataPromise.then(_data => setData(_data));
  }, [dataPromise]);

  const handleReady = useCallback(() => setLoading(false), []);

  const chartComponent = useMemo(
    () => <ChartComponent data={data} onReady={handleReady} {...restProps} />,
    [data, handleReady, restProps]
  );

  return (
    <div
      className="chart loading"
      style={{ minHeight: `${restProps.layout.height}px` }}
      ref={graphPrintRef}
    >
      <div className="chart-header" id={`chart-header-${restProps.id}`}>
        <span className="title">{title}</span>
        {!am4chartMenu && <Menu chartReference={graphPrintRef} />}
      </div>
      <div className="chart-principal" style={{ opacity: loading ? 0.6 : 1 }}>
        {chartComponent}
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default Chart;
