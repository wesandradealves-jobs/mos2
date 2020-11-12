import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Pagination from './pagination';

import { typesComponent } from '../../../../config/loan';

import { ReactComponent as Outros } from '../../../../img/prod-icons/outros.svg';

import { useMall } from '../../../../hooks/Mall';

import ApiClient from '../../../../services/api';

const api = new ApiClient();

const AvailableProducts = ({ itemSelectedChange, itemTypeChange, reset }) => {
  const { mallId } = useMall();

  const [limit, setLimit] = useState(24);
  const [stock, setStock] = useState([]);
  const [totalAvailableItems, setTotalAvailableItems] = useState('');
  const [stockSlice, setStockSlice] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [itemTypes, setItemTypes] = useState([]);
  const [itemTypeSelectedId, setItemTypeSelectedId] = useState('');
  const [itemTypeSelectedName, setItemTypeSelectedName] = useState('');

  useEffect(() => {
    const load = async () => {
      const types = await api.getLoanItemTypes(mallId);
      if (types.length > 0) {
        setItemTypes(types);
        setItemTypeSelectedId(types[0].id);
        setItemTypeSelectedName(types[0].name);
      }
    };
    load();
  }, [mallId]);

  useEffect(() => {
    setStockSlice(stock.slice((currentPage - 1) * limit, currentPage * limit));
  }, [currentPage, limit, stock]);

  const loadStock = useCallback(async () => {
    if (itemTypeSelectedId && itemTypeSelectedId !== 'DEFAULT') {
      const itemsStock = await api.getLoanItemStock(mallId, itemTypeSelectedId);
      setStock(itemsStock);
      setTotalAvailableItems(itemsStock.filter(item => !item.loaned).length);
    } else {
      setStock([]);
    }
  }, [itemTypeSelectedId, mallId]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  useEffect(() => {
    itemTypeChange(itemTypeSelectedId, itemTypeSelectedName);
  }, [itemTypeChange, itemTypeSelectedId, itemTypeSelectedName]);

  useEffect(() => {
    if (reset) {
      loadStock();
      document
        .querySelectorAll('input[name=option-item]')
        .forEach(el => (el.checked = false));
    }
  }, [loadStock, reset]);

  const handleChangeItemType = useCallback(event => {
    const label = event.target.childNodes[event.target.selectedIndex].text;
    setItemTypeSelectedId(event.target.value);
    setItemTypeSelectedName(label);
    setStock([]);
    if (label === 'Carrinho de Bebê') {
      setLimit(24);
    } else {
      setLimit(12);
    }
  }, []);

  const handleSelectItem = useCallback(
    event => itemSelectedChange(event.target.value),
    [itemSelectedChange]
  );

  const availableProducts = useMemo(
    () =>
      stockSlice.map(item => {
        let ImageComponent;
        const Component = typesComponent[itemTypeSelectedName];
        if (Component) {
          ImageComponent = (
            <Component title={itemTypeSelectedName} className="image" />
          );
        } else {
          ImageComponent = (
            <Outros title={itemTypeSelectedName} className="image" />
          );
        }
        return (
          <React.Fragment key={item.id}>
            <input
              type="radio"
              name="option-item"
              id={`option-${item.id}`}
              disabled={item.loaned}
              value={item.id}
              onClick={handleSelectItem}
            />
            <label
              className={`option-item ${item.loaned && 'disabled'}`}
              htmlFor={`option-${item.id}`}
            >
              {ImageComponent}
              <p className="number">{item.tag}</p>
            </label>
          </React.Fragment>
        );
      }),
    [handleSelectItem, itemTypeSelectedName, stockSlice]
  );

  return (
    <div className="available-products">
      <label className="label-input available-productst form-input">ITEM</label>
      <select
        onChange={handleChangeItemType}
        value={itemTypeSelectedId}
        className={`${itemTypeSelectedId !== 'DEFAULT' ? '-selected' : ''}`}
      >
        <option key="DEFAULT" value="DEFAULT" disabled>
          -- SELECIONE --
        </option>
        {itemTypes &&
          itemTypes.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>

      {itemTypeSelectedName && stockSlice.length > 0 ? (
        <div className="box options-items">
          <div className="products-items">{availableProducts}</div>

          <div className="products-pagination">
            <Pagination
              totalItems={stock.length}
              totalAvailableItems={totalAvailableItems}
              limit={limit}
              setPage={page => setCurrentPage(page)}
            />
          </div>
        </div>
      ) : (
        <div className="box">
          <label className="noStock">Nenhum item encontrado</label>
        </div>
      )}
    </div>
  );
};

export default AvailableProducts;
