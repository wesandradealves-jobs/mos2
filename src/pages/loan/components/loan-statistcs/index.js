import React, { useState, useEffect, useMemo } from 'react';

import { typesComponent } from '../../../../config/loan';

import ComponentWithTooltip from '../../../../components/withTooltip';
import { ReactComponent as Outros } from '../../../../img/prod-icons/outros.svg';

const LoanStatistcs = ({ data, onReady }) => {
  const [itemTypes, setItemTypes] = useState([]);
  const [total, setTotal] = useState('');

  useEffect(() => {
    data && setItemTypes(data.filter(type => type.name !== 'total'));
    data && setTotal(data.find(type => type.name === 'total').total);
    onReady();
  }, [data, onReady]);

  const typesStatistcs = useMemo(
    () =>
      itemTypes.map(type => {
        let ImageComponent;
        const Component = typesComponent[type.name];
        if (Component) {
          ImageComponent = <Component className="image" />;
        } else {
          ImageComponent = <Outros className="image" />;
        }
        return (
          <div className="item" key={type.name}>
            <ComponentWithTooltip
              title={type.name}
              styles={{
                span: {
                  position: 'absolute',
                  bottom: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  width: 'unset',
                },
              }}
              className="mytooltip -turquoise"
            >
              <div className="avatar">{ImageComponent}</div>
            </ComponentWithTooltip>
            <div className="details">
              <label>{type.total}</label>
              <p>Clientes</p>
            </div>
          </div>
        );
      }),
    [itemTypes]
  );

  return (
    <div className="loan-statistcs">
      <div className="header">
        <h1>{total}</h1>
        <p>Clientes usaram o empréstimo do shopping</p>
      </div>
      <div className="types">{typesStatistcs}</div>
    </div>
  );
};

export default LoanStatistcs;
