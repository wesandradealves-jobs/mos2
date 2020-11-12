import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import AddItems from '../components/new-item';

import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const ModalAddItem = ({ onSubmit }) => {
  const { register, handleSubmit, errors, watch, getValues } = useForm({
    mode: 'onBlur',
  });

  const { mallId } = useMall();

  const [itemTypes, setItemTypes] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [availableIds, setAvailableIds] = useState([]);

  useEffect(() => {
    const loanItemsType = async () => {
      const data = await api.getLoanItemTypes(mallId);
      setItemTypes([...data, { id: 'new', name: 'INCLUIR NOVO ITEM' }]);
    };
    loanItemsType();
  }, [mallId]);

  const generateItems = useCallback(
    async (value, type) => {
      if (value && type !== 'DEFAULT') {
        let avaibleItemsIds;
        if (type === 'new') {
          avaibleItemsIds = Array.from(
            { length: value },
            (_, index) => index + 1
          );
        } else {
          avaibleItemsIds = await api.getAvaibleLoanItemsIds(
            value,
            mallId,
            type
          );
        }

        setAvailableIds(avaibleItemsIds);

        const items = avaibleItemsIds.map(id => ({
          id,
        }));
        setNewItems(items);
      }
    },
    [mallId]
  );

  const handleQuantityChange = useCallback(
    async event => generateItems(event.target.value, getValues('itemType')),
    [generateItems, getValues]
  );

  const handleItemTypeChange = useCallback(
    async event => generateItems(getValues('quantity'), event.target.value),
    [generateItems, getValues]
  );

  const handleChangeItemsInputs = useCallback(
    event => {
      const itemsChanged = [...newItems];

      const itemFound = itemsChanged.find(
        item => item.id.toString() === event.target.dataset.id
      );
      itemFound[event.target.name] = event.target.value;

      setNewItems(itemsChanged);
    },
    [newItems]
  );

  const handleAddItem = useCallback(
    async formData => {
      let itemTypeId;
      if (formData.itemType === 'new') {
        const { id } = await api.createLoanItemType(mallId, {
          name: formData.itemName,
        });
        itemTypeId = id;
      } else {
        itemTypeId = parseInt(formData.itemType, 10);
      }

      const promises = newItems.map((item, index) => {
        const availableId = availableIds[index];

        const data = {
          tag: availableId,
          typeId: itemTypeId,
          inventoryNumber: item[`inventoryNumber-${item.id}`],
          model: item[`model-${item.id}`],
          status: item[`status-${item.id}`],
        };

        return api.createLoanItem(mallId, data);
      });

      popUp.processPromises('Adicionando itens...', Promise.all(promises), {
        successCallback: () => {
          onSubmit();
        },
        successMsg: 'Itens adicionados com sucesso!',
      });
    },
    [newItems, onSubmit, mallId, availableIds]
  );
  return (
    <div className="modal-coalition">
      <Container style={{ padding: '0px' }}>
        <Row>
          <Col>
            <h5>ADICIONAR ITEM</h5>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={9}>
            <label className="label-input form-input">ITEM</label>
            <select
              name="itemType"
              ref={register({
                validate: value => value !== 'DEFAULT',
              })}
              defaultValue="DEFAULT"
              className={`${
                errors.itemType
                  ? 'coaliton-form-error'
                  : watch('itemType') !== 'DEFAULT' && ' -selected'
              }`}
              onChange={handleItemTypeChange}
            >
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              {itemTypes ? (
                itemTypes.map(item => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option>Loading</option>
              )}
            </select>
          </Col>
          <Col xs={12} lg={3}>
            <label className="label-input form-input">QUANTIDADE*</label>
            <input
              type="number"
              name="quantity"
              ref={register({
                required: true,
              })}
              className={`${errors.quantity ? 'coaliton-form-error' : ''}`}
              required
              onChange={handleQuantityChange}
            />
          </Col>
        </Row>
        {getValues('itemType') === 'new' && (
          <Row>
            <Col>
              <label className="label-input form-input">NOME DO ITEM*</label>
              <input
                name="itemName"
                type="text"
                ref={register({
                  required: true,
                })}
                className={`${errors.itemName ? 'coaliton-form-error' : ''}`}
                required
              />
            </Col>
          </Row>
        )}
        {getValues('quantity') > 0 && (
          <AddItems
            availableIds={availableIds}
            handleItemsChange={handleChangeItemsInputs}
            formRegister={register}
            formWatch={watch}
            formErrors={errors}
          />
        )}
        <Row className="footer-modal">
          <button
            className="button-default -action -small"
            onClick={handleSubmit(handleAddItem)}
          >
            Salvar
          </button>
        </Row>
      </Container>
    </div>
  );
};

export default ModalAddItem;
