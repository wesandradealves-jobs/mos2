import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';

import MyDatatable from '../../../components/datatable/MyDatatable';
import ControlCustomSearch from '../components/control-custom-search';

import Actions from '../../../components/actions-dropdown';
import ModalBenefit from '../modals/modal-benefit';
import ModalTag from '../modals/modal-tag';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

const api = new ApiClient();
const popUp = new PopUp();

// ACTIONS FOR DATATABLE COLUMNS
const limit = 10;

const actions = ['Editar', 'Excluir'];

const SectionControl = () => {
  const { malls, employee } = useSession();
  const { mallId, setMallId } = useMall();

  const [datatableColumns, setDatatableColumns] = useState([]);
  const [datatableOptions, setDatatableOption] = useState([]);

  const [datatableData, setDatatableData] = useState([]);
  const [reloadData, setReloadData] = useState(true);
  const [loading, setLoading] = useState(true);

  const [advantageType, setAdvantageType] = useState('benefits');

  const [showModal, setShowModal] = useState(false);

  const [modalActionBenefitType, setModalActionBenefitType] = useState();
  const [modalActionTagType, setModalActionTagType] = useState();

  const [benefitForModal, setBenefitForModal] = useState({});
  const [tagForModal, setTagForModal] = useState({});

  const [categories, setCategories] = useState();

  // LOAD LOYALTY CATEGORIES FROM API

  useEffect(() => {
    api.listCategories(mallId).then(data => setCategories(data));
  }, [mallId]);

  const handleMallChange = useCallback(
    id => {
      setDatatableData([]);
      setMallId(id);
    },
    [setMallId]
  );

  const handleAdvantageTypeChange = useCallback(value => {
    setDatatableData([]);
    setAdvantageType(value);
  }, []);

  // LOAD DATATABLE OPTIONS WITH CUSTOM SEARCH COMPONENT

  const customSearchComponent = useCallback(
    (searchText, handleSearch, hideSearch) => {
      return (
        <ControlCustomSearch
          malls={malls}
          searchText={searchText}
          onSearch={handleSearch}
          onHide={hideSearch}
          renderType="coalitionControl"
          onAdvantageChange={handleAdvantageTypeChange}
          onMallChange={handleMallChange}
          currentMallId={mallId}
        />
      );
    },
    [malls, handleAdvantageTypeChange, handleMallChange, mallId]
  );

  useEffect(() => {
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
    setDatatableOption(options);
  }, [customSearchComponent, loading]);

  const customTableThemeBenefits = useMemo(
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
            '&:nth-child(4)': {
              width: '220px',
              textAlign: 'left',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              textAlign: 'left',
            },
            '&:nth-child(8)': {
              width: '220px',
              textAlign: 'left',
            },
          },
        },
      },
    }),
    []
  );

  const customTableThemeTags = useMemo(
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
            '&:nth-child(3)': {
              width: '220px',
              textAlign: 'left',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              textAlign: 'left',
            },
            '&:nth-child(6)': {
              width: '220px',
              textAlign: 'left',
            },
          },
        },
      },
    }),
    []
  );

  const handleBenefitActionClick = useCallback(
    async (id, action) => {
      if (action === 'Excluir' && id && mallId) {
        popUp.showConfirmation('Deseja excluir o benefício?', () => {
          popUp.processPromises(
            'Excluindo benefício...',
            api.patchBenefit(mallId, id, {
              enabled: false,
              employeeId: employee.id,
            }),
            {
              successCallback: () => {
                const newDatatableData = datatableData.filter(
                  row => row[row.length - 1] !== id
                );
                setDatatableData(newDatatableData);
              },
              successMsg: 'Benefício excluído com sucesso!',
            }
          );
        });
      }

      if (action === 'Editar' && id && mallId) {
        const findBenefit = await api.getBenefit(mallId, id);
        setBenefitForModal({ ...findBenefit, id });
        setModalActionBenefitType('edit');
        setShowModal(true);
      }
    },

    [datatableData, mallId, employee.id]
  );

  // DEFINING COLUMNS AND ACTIONS FOR DATATABLE

  const handleTagActionClick = useCallback(
    async (id, action) => {
      if (action === 'Excluir' && id && mallId) {
        popUp.showConfirmation('Deseja excluir o multiplicador?', () => {
          popUp.processPromises(
            'Excluindo multiplicador...',
            api.patchTag(mallId, id, {
              enabled: false,
              employeeId: employee.id,
            }),
            {
              successCallback: () => {
                const newDatatableData = datatableData.filter(
                  row => row[row.length - 1] !== id
                );

                setDatatableData(newDatatableData);
              },
              successMsg: 'Multiplicador excluído com sucesso!',
            }
          );
        });
      }

      if (action === 'Editar' && id && mallId) {
        const findTag = await api.getTag(mallId, id);
        setTagForModal({ ...findTag, id });

        setModalActionTagType('edit');
        setShowModal(true);
      }
    },

    [datatableData, mallId, employee.id]
  );

  const datatableBenefitsColumns = useMemo(
    () => [
      {
        name: 'Nome do Benefício',
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
        name: 'Quant Disponível',
        options: {
          filter: true,
          customBodyRender: value => {
            let label = value;
            if (value === 0) label = '-';
            return <p style={{ margin: '0' }}>{label}</p>;
          },
        },
      },
      {
        name: 'Validade',
        options: {
          filter: true,
        },
      },
      {
        name: 'Exclusividade',
        options: {
          filter: true,
          customBodyRender: value => <p className="column-overflow">{value}</p>,
        },
      },
      {
        name: 'Ação',
        options: {
          filter: false,
          customBodyRender: value => {
            return (
              <Actions
                value={value}
                onActionClick={handleBenefitActionClick}
                actions={actions}
              />
            );
          },
        },
      },
    ],
    [handleBenefitActionClick]
  );

  const datatableTagsColumns = useMemo(
    () => [
      {
        name: 'Nome do Multiplicador',
        options: {
          filter: true,
        },
      },
      {
        name: 'Valor',
        options: {
          filter: true,
          customBodyRender: value => (
            <p style={{ margin: '0' }}>{`${value}x`}</p>
          ),
        },
      },
      {
        name: 'Validade',
        options: {
          filter: true,
        },
      },
      {
        name: 'Ação',
        options: {
          filter: false,
          customBodyRender: value => {
            return (
              <Actions
                value={value}
                onActionClick={handleTagActionClick}
                actions={actions}
              />
            );
          },
        },
      },
    ],
    [handleTagActionClick]
  );

  // LOAD COLUMNS TO DATATABLE

  useEffect(() => {
    if (advantageType === 'benefits') {
      setDatatableColumns(datatableBenefitsColumns);
    }
    if (advantageType === 'tags') {
      setDatatableColumns(datatableTagsColumns);
    }
  }, [datatableBenefitsColumns, datatableTagsColumns, advantageType]);

  // LOAD DATA FROM API TO DATATABLE

  useEffect(() => {
    const loadData = async () => {
      if (advantageType === 'benefits') {
        try {
          setLoading(true);
          const { data } = await api.getBenefits(mallId, {
            isEnabled: true,
          });
          const transformedData = data.map(benefit => {
            const row = [];
            row.push(benefit.name);
            row.push(benefit.points);
            if (benefit.amountAvailable) {
              row.push(benefit.amountAvailable);
            } else {
              row.push(0);
            }
            const startDateFormatted = format(
              parseISO(benefit.startDate),
              'dd/MM/yyyy'
            );
            const endDateFormatted = format(
              parseISO(benefit.endDate),
              'dd/MM/yyyy'
            );
            row.push(`${startDateFormatted} até ${endDateFormatted}`);
            row.push(
              benefit.loyaltyCategories.reduce(
                (acc, category, idx) =>
                  `${acc}${idx > 0 ? ', ' : ''}${category.name}`,
                ''
              )
            );
            row.push(benefit.id);
            return row;
          });
          setDatatableData(transformedData);
        } catch {
          setDatatableData([]);
        } finally {
          setReloadData(false);
          setLoading(false);
        }
      }
      if (advantageType === 'tags') {
        try {
          setLoading(true);
          const { data } = await api.getTags(mallId, {
            isEnabled: true,
          });
          const transformedData = data.map(tag => {
            const row = [];
            row.push(tag.name);
            row.push(tag.multiplier);
            const startDateFormatted = format(
              parseISO(tag.startDate),
              'dd/MM/yyyy'
            );
            const endDateFormatted = format(
              parseISO(tag.endDate),
              'dd/MM/yyyy'
            );
            row.push(`${startDateFormatted} até ${endDateFormatted}`);
            row.push(tag.id);
            return row;
          });
          setDatatableData(transformedData);
        } catch {
          setDatatableData([]);
        } finally {
          setReloadData(false);
          setLoading(false);
        }
      }
    };
    loadData();
  }, [mallId, advantageType, reloadData]);

  // HANDLE MODAL SUBMIT

  const handleModalBenefitSubmit = useCallback(
    (data, type) => {
      if (type === 'new') {
        popUp.processPromises(
          'Adicionando benefício...',
          api.createBenefit(mallId, {
            name: data.name,
            points: data.points,
            storeId: data.store ? data.store.id : null,
            startDate: data.startDate,
            endDate: data.endDate,
            amountTotal: data.amountTotal,
            limitPerClient: data.limitPerClient,
            rechargeable: data.rechargeable,
            loyaltyCategories: data.loyaltyCategories,
            enabled: true,
            employeeId: employee.id,
          }),
          {
            successCallback: () => {
              setShowModal(false);
              setReloadData(true);
            },
            successMsg: 'Benefício cadastrado com sucesso!',
          }
        );
      }
      if (type === 'edit') {
        popUp.processPromises(
          'Salvando benefício...',
          api.patchBenefit(mallId, benefitForModal.id, {
            name: data.name,
            points: data.points,
            storeId: data.store ? data.store.id : null,
            startDate: data.startDate,
            endDate: data.endDate,
            amountTotal: data.amountTotal,
            limitPerClient: data.limitPerClient,
            rechargeable: data.rechargeable,
            loyaltyCategories: data.loyaltyCategories,
            employeeId: employee.id,
          }),
          {
            successCallback: () => {
              setShowModal(false);
              setReloadData(true);
            },
            successMsg: 'Benefício cadastrado com sucesso!',
          }
        );
      }
    },
    [mallId, employee.id, benefitForModal.id]
  );

  const handleModalTagSubmit = useCallback(
    (data, type) => {
      if (type === 'new') {
        popUp.processPromises(
          'Adicionando multiplicador...',
          api.createTag(mallId, {
            multiplier: data.multiplier,
            startDate: data.startDate,
            endDate: data.endDate,
            name: data.name,
            enabled: true,
            employeeId: employee.id,
          }),
          {
            successCallback: () => {
              setShowModal(false);
              setReloadData(true);
            },
            successMsg: 'Multiplicador cadastrado com sucesso!',
          }
        );
      }
      if (type === 'edit') {
        popUp.processPromises(
          'Salvando multiplicador...',
          api.patchTag(mallId, tagForModal.id, {
            multiplier: data.multiplier,
            startDate: data.startDate,
            endDate: data.endDate,
            name: data.name,
            employeeId: employee.id,
          }),
          {
            successCallback: () => {
              setShowModal(false);
              setReloadData(true);
            },
            successMsg: 'Alterações realizadas com sucesso!',
          }
        );
      }
    },
    [mallId, employee.id, tagForModal.id]
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <MyDatatable
            data={datatableData}
            rowsPerPage={limit}
            columns={datatableColumns}
            options={datatableOptions}
            customTheme={
              advantageType === 'benefits'
                ? customTableThemeBenefits
                : customTableThemeTags
            }
          />
        </Col>
      </Row>
      <Row className="button-disclaimer-row">
        <Col className="input-fields-container">
          <button
            className="button-default -action -small align-center"
            onClick={() => {
              if (advantageType === 'benefits') {
                setBenefitForModal({});
                setModalActionBenefitType('new');
              }
              if (advantageType === 'tags') {
                setTagForModal({});
                setModalActionTagType('new');
              }
              setShowModal(true);
            }}
          >
            {advantageType === 'benefits'
              ? 'ADICIONAR BENEFÍCIO'
              : 'ADICIONAR MULTIPLICADOR'}
          </button>
        </Col>
      </Row>
      <Modal
        show={showModal}
        size="xl"
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
        {advantageType === 'benefits' ? (
          <ModalBenefit
            onSubmit={handleModalBenefitSubmit}
            benefit={benefitForModal}
            actionType={modalActionBenefitType}
            categories={categories}
            mallId={mallId}
          />
        ) : (
          <ModalTag
            onSubmit={handleModalTagSubmit}
            tag={tagForModal}
            actionType={modalActionTagType}
          />
        )}
      </Modal>
    </>
  );
};

export default SectionControl;
