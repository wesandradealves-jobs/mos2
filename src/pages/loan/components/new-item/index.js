import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import { itemStatus } from '../../../../config/loan';

const NewItems = ({
  availableIds,
  handleItemsChange,
  formRegister,
  formErrors,
  formWatch,
}) => {
  return (
    <Row className="scroll-view">
      {availableIds.length > 0 &&
        availableIds.map(id => {
          const model = `model-${id}`;
          const inventoryNumber = `inventoryNumber-${id}`;
          const statusSelector = `status-${id}`;

          return (
            <Container key={id}>
              <Row>
                <Col xs={12}>
                  <label className="label-input form-input">
                    {`DADOS DO ITEM ${id}`}
                  </label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4}>
                  <label className="label-input form-input">MODELO*</label>
                  <input
                    id={model}
                    name={model}
                    ref={formRegister({
                      required: true,
                    })}
                    className={`${
                      formErrors[model] ? 'coaliton-form-error' : ''
                    }`}
                    data-id={id}
                    type="text"
                    onChange={handleItemsChange}
                    required
                  />
                </Col>
                <Col xs={12} md={4}>
                  <label className="label-input form-input">
                    N° DE PATRIMÔNIO*
                  </label>
                  <input
                    id={inventoryNumber}
                    name={inventoryNumber}
                    ref={formRegister({
                      required: true,
                    })}
                    className={`${
                      formErrors[inventoryNumber] ? 'coaliton-form-error' : ''
                    }`}
                    data-id={id}
                    type="text"
                    onChange={handleItemsChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <label className="label-input form-input">ITEM*</label>
                  <select
                    id={statusSelector}
                    name={statusSelector}
                    data-id={id}
                    defaultValue="DEFAULT"
                    ref={formRegister({
                      validate: value => value !== 'DEFAULT',
                    })}
                    className={`${
                      formErrors[statusSelector]
                        ? 'coaliton-form-error'
                        : formWatch(statusSelector) !== 'DEFAULT' &&
                          ' -selected'
                    }`}
                    onChange={handleItemsChange}
                  >
                    <option value="DEFAULT" disabled>
                      -- Selecione --
                    </option>
                    {Object.entries(itemStatus).map(([key, value]) => (
                      <option value={key} key={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            </Container>
          );
        })}
    </Row>
  );
};

export default NewItems;
