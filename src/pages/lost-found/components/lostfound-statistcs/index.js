import React, { useState, useEffect } from 'react';

import { ReactComponent as Returned } from '../../../../img/prod-icons/checked.svg';
import { ReactComponent as NotReturned } from '../../../../img/prod-icons/turn-back.svg';

const LostFoundStatistcs = ({ data, onReady }) => {
  const [itemsReturned, setItemsReturned] = useState();
  const [itemsNotReturned, setItemsNotReturned] = useState();
  const [total, setTotal] = useState('');

  useEffect(() => {
    data && setItemsReturned(data[0].returnedItems);
    data && setItemsNotReturned(data[0].notReturnedItems);
    data && setTotal(data[0].totalItems);
    onReady();
  }, [data, onReady]);

  return (
    <div className="lostfound-statistcs">
      <div className="header">
        <h1>{total}</h1>
        <p>Total de registros</p>
      </div>
      <div className="types">
        <div className="type">
          <div className="avatar">
            <Returned className="image" />
          </div>
          <div className="details">
            <strong>{itemsReturned}</strong>
            <p>Registros concluidos</p>
          </div>
        </div>
        <div className="type">
          <div className="avatar">
            <NotReturned className="image" />
          </div>
          <div className="details">
            <strong>{itemsNotReturned}</strong>
            <p>Registros em aberto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFoundStatistcs;
