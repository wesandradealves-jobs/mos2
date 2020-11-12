import React, { useCallback, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import _ from 'lodash';

const Menu = ({ chartReference }) => {
  const [showMenu, setShowMenu] = useState();
  const handlePrint = useReactToPrint({
    content: () => chartReference.current,
  });
  const handleGraphPrint = useCallback(() => {
    setShowMenu(false);
    handlePrint();
  }, [handlePrint]);

  return (
    <div
      onMouseOver={() => setShowMenu(true)}
      onFocus={() => setShowMenu(true)}
      onMouseLeave={_.debounce(() => {
        setShowMenu(false);
      }, 500)}
      className="graph-menu no-printme"
    >
      <button type="button">
        <img src="/icons/action-icons/graph_menu.svg" alt="Menu" />
      </button>
      {showMenu && (
        <div className="menu">
          <button type="button" onClick={handleGraphPrint}>
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
