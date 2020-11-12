/* eslint-disable no-restricted-globals */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import AsyncSelect from 'react-select/async';
import * as Yup from 'yup';
import { Row, Col, Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import permissions from '../../../config/permissions';

import { useClient } from '../../../hooks/Client';
import { useMall } from '../../../hooks/Mall';
import { useSession } from '../../../hooks/Session';

import ComponentWithTooltip from '../../../components/withTooltip';
import MyDatatable from '../../../components/datatable/MyDatatable';

import BenefitsCustomsearch from '../components/benefits-custom-search';
import ModalRechargeableBenefit from '../modals/modal-rechargeableBenefit';
import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const limit = 10;

const ValidationSchema = Yup.object().shape({
  debit: Yup.number()
    .transform(v => (isNaN(v) ? null : v))
    .nullable(true)
    .moreThan(0),
  credit: Yup.number().when('debit', {
    is: val => {
      return val;
    },
    then: Yup.number()
      .transform(v => (isNaN(v) ? null : v))
      .nullable(true)
      .moreThan(0),
  }),
});

const SectionBenefits = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    errors,
    clearError,
    setValue,
    watch,
  } = useForm({
    validationSchema: ValidationSchema,
    defaultValues: {
      debit: '',
      credit: '',
      tags: [],
    },
    mode: 'onBlur',
  });

  const { malls, employee, verifyPermission } = useSession();
  const { mallId, setMallId } = useMall();
  const { clientCpf } = useClient();

  const [tagsCacheOption, setTagsCacheOption] = useState(true);
  const [tagDisabled, setTagDisabled] = useState(true);

  const [benefitsData, setBenefitsData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [benefitRechargeableId, setBenefitRechargeableId] = useState();

  const loadBenefits = useCallback(async () => {
    try {
      if (clientCpf) {
        setLoading(true);
        const { data } = await api.getBenefits(mallId, {
          cpf: clientCpf,
          isEnabled: true,
        });

        const transformedData = data.map(benefit => {
          const row = [];
          row.push(benefit.name);
          row.push(benefit.points);
          if (benefit.amountAvailable) {
            row.push(benefit.amountAvailable);
          } else {
            row.push('-');
          }
          if (benefit.rechargeable) {
            row.push('RECHARGEABLE');
          } else {
            row.push(1);
          }
          row.push(benefit.id);
          return row;
        });
        setBenefitsData(transformedData);
      } else {
        setBenefitsData([]);
      }
    } catch {
      setBenefitsData([]);
    } finally {
      setLoading(false);
    }
  }, [clientCpf, mallId]);

  useEffect(() => {
    loadBenefits();
  }, [loadBenefits]);

  const handleRedeemBenefit = useCallback(
    async (event, id, quantity) => {
      event.preventDefault();
      if (quantity === 'RECHARGEABLE') {
        setBenefitRechargeableId(id);
        setShowModal(true);
      } else {
        popUp.showConfirmation('Deseja confirmar o resgate?', () => {
          popUp.processPromises(
            'Resgatando benefício...',
            api.redeemBenefit(mallId, id, {
              cpf: clientCpf,
              amount: parseInt(quantity, 10),
              employeeId: employee.id,
            }),
            {
              successCallback: () => {
                setTimeout(() => onSubmit(), 2000);
                loadBenefits();
              },
              successMsg: 'Resgate realizado com sucesso!',
            }
          );
        });
      }
    },
    [clientCpf, loadBenefits, mallId, onSubmit, employee.id]
  );

  const handleModalRechargeableBenefitSubmit = useCallback(
    (id, rechargeCode) => {
      popUp.showConfirmation('Deseja confirmar o resgate?', () => {
        popUp.processPromises(
          'Resgatando benefício...',
          api.redeemBenefit(mallId, id, {
            cpf: clientCpf,
            rechargeCode,
            employeeId: employee.id,
          }),
          {
            successCallback: () => {
              setTimeout(() => onSubmit(), 2000);
              loadBenefits();
              setShowModal(false);
            },
            successMsg: 'Resgate realizado com sucesso!',
          },
          () => setShowModal(false)
        );
      });
    },
    [mallId, clientCpf, employee.id, loadBenefits, onSubmit]
  );

  const handleMallChange = useCallback(
    async id => {
      setMallId(id);
      setValue('tags', []);
      setTagsCacheOption(false);
    },
    [setMallId, setValue]
  );

  const customSearchComponent = useCallback(
    (searchText, handleSearch, hideSearch) => {
      return (
        <BenefitsCustomsearch
          malls={malls}
          searchText={searchText}
          onSearch={handleSearch}
          onHide={hideSearch}
          renderType="coalitionBenefits"
          onMallChange={handleMallChange}
          currentMallId={mallId}
        />
      );
    },
    [handleMallChange, mallId, malls]
  );

  const handleDebitChange = useCallback(() => {
    setValue('credit', '');
    setValue('tags', []);
    clearError('credit');
    setTagDisabled(true);
  }, [clearError, setValue]);

  const handleCreditChange = useCallback(() => {
    setValue('debit', '');
    clearError('debit');
    setTagDisabled(false);
  }, [clearError, setValue]);

  const tagsOptions = useCallback(
    (inputValue, callback) => {
      if (mallId && inputValue.length >= 3) {
        api
          .getTags(mallId, {
            search: inputValue,
            isEnabled: true,
            isExpired: false,
          })
          .then(response => {
            const { data } = response;
            callback(data);
          });
        return true;
      }
      callback([]);
      return true;
    },
    [mallId]
  );

  const saveMovementOfPoints = useCallback(
    data => {
      popUp.processPromises(
        data.credit ? 'Creditando pontos...' : 'Debitando pontos...',
        api.creditOrDebitPoints(mallId, clientCpf, {
          points: data.credit ? data.credit : data.debit,
          type: data.credit ? 'credit' : 'debit',
          tags: data.tags.map(tag => tag.id),
          employeeId: employee.id,
        }),
        {
          successCallback: () => {
            setTimeout(() => onSubmit(), 2000);
            reset();
          },
          successMsg: 'Operação realizada com sucesso!',
        },
        () => setShowModal(false)
      );
    },
    [clientCpf, mallId, onSubmit, reset, employee.id]
  );

  const handleInputInteger = useCallback(event => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode === 46 ||
      (charCode > 31 && (charCode < 48 || charCode > 57))
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }, []);

  const datatableOptions = useMemo(() => {
    const options = {
      print: false,
      filter: true,
      download: false,
      rowsPerPage: limit,
      textLabels: {
        body: {
          noMatch: loading
            ? 'Carregando'
            : 'Desculpe, nenhum registro encontrado',
        },
      },
      customSearchRender: customSearchComponent,
    };
    return options;
  }, [customSearchComponent, loading]);

  const datableColumns = useMemo(
    () => [
      {
        name: 'Benefício',
        options: {
          filter: true,
        },
      },
      {
        name: 'Pontos',
        options: {
          filter: true,
        },
      },
      {
        name: 'Estoque',
        options: {
          filter: true,
        },
      },
      {
        name: 'Quantidade',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return value !== 'RECHARGEABLE' ? (
              <input
                type="number"
                min="0"
                value={value}
                style={{ maxWidth: ' 80px' }}
                onChange={event => {
                  const re = /^[0-9\b]+$/;
                  if (re.test(event.target.value)) {
                    updateValue(event.target.value);
                  }
                }}
              />
            ) : (
              '-'
            );
          },
        },
      },
      {
        name: 'Resgate',
        options: {
          filter: false,
          customBodyRender: (benefitId, tableMeta) => {
            return (
              <button
                className="button-take-benefits"
                type="button"
                onClick={event =>
                  handleRedeemBenefit(event, benefitId, tableMeta.rowData[3])
                }
              >
                RESGATAR
              </button>
            );
          },
        },
      },
    ],
    [handleRedeemBenefit]
  );

  const customTableTheme = useMemo(
    () => ({
      overrides: {
        MUIDataTableToolbar: {
          icon: {
            display: 'none',
          },
        },
        MUIDataTableHeadCell: {
          root: {
            '&:nth-child(1)': {
              textAlign: 'left',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              textAlign: 'left',
            },
          },
        },
      },
    }),
    []
  );

  return (
    <>
      <MyDatatable
        data={benefitsData}
        rowsPerPage={limit}
        columns={datableColumns}
        options={datatableOptions}
        customTheme={customTableTheme}
      />
      {verifyPermission(
        mallId,
        permissions.COALITION_ACTION_CREDIT_DEBIT_POINTS
      ) && (
        <div className="move-points">
          <Row>
            <Col>
              <div className="tool-tip" style={{ justifyContent: 'center' }}>
                <h5 className="subtitle">MOVIMENTAÇÃO DE PONTOS</h5>
                <ComponentWithTooltip
                  title={
                    <p>
                      Campo destinado a concessão manual de pontos.
                      <br />
                      ex: Inserção manual de pontos sem nota fiscal
                      correspondente.
                    </p>
                  }
                  styles={{
                    span: {
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '51%',
                      transform: 'translateX(-49%)',
                    },
                  }}
                  className="mytooltip"
                >
                  <img
                    src="/icons/action-icons/tooltip.svg"
                    alt="Tooltip"
                    style={{
                      width: '20px',
                      marginLeft: '10px',
                      paddingBottom: '3px',
                    }}
                  />
                </ComponentWithTooltip>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <label className="label-input form-input">
                CREDITAR PONTOS (+)
              </label>
              <input
                type="text"
                onKeyPress={handleInputInteger}
                name="credit"
                ref={register}
                onChange={handleCreditChange}
                className={`${errors.credit ? 'coaliton-form-error' : ''}`}
                required
              />
            </Col>
            <Col xs={6}>
              <label className="label-input form-input">
                DEBITAR PONTOS (-)
              </label>
              <input
                type="text"
                onKeyPress={handleInputInteger}
                name="debit"
                ref={register}
                onChange={handleDebitChange}
                className={`${errors.debit ? 'coaliton-form-error' : ''}`}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <label className="label-input form-input">
                MULTIPLICADOR DE PONTOS
              </label>
              <Controller
                as={<AsyncSelect />}
                control={control}
                name="tags"
                className="basic-multi-select"
                loadOptions={_.debounce(tagsOptions, 500)}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.name}
                loadingMessage={() => 'Carregando'}
                noOptionsMessage={() => 'Sem opção'}
                cacheOptions={tagsCacheOption}
                isMulti
                isDisabled={tagDisabled}
                styles={{
                  control: base => ({
                    ...base,
                    borderColor:
                      watch('tags') &&
                      watch('tags').length > 0 &&
                      '#54bbab !important',
                  }),
                }}
              />
            </Col>
          </Row>
          <Row className="row-btn-save">
            <Col>
              <button
                className="button-default -action -small align-center"
                onClick={handleSubmit(saveMovementOfPoints)}
                disabled={!clientCpf}
              >
                SALVAR
              </button>
            </Col>
          </Row>
        </div>
      )}
      <Modal
        show={showModal}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onHide={() => {
          setShowModal(false);
        }}
      >
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="modal-close-button"
        >
          <img src="/icons/action-icons/close.svg" alt="Close" />
        </button>
        <ModalRechargeableBenefit
          onSubmit={(id, rechargeCode) =>
            handleModalRechargeableBenefitSubmit(id, rechargeCode)
          }
          benefitId={benefitRechargeableId}
        />
      </Modal>
    </>
  );
};

export default SectionBenefits;
