import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';

import permissions from '../../config/permissions';

import SectionControl from './sections/section-control';
import SectionEdition from './sections/section-edition';
import SectionNewOccurrence from './sections/section-new-occurrence';
import SectionReport from './sections/section-report';
import SectionTitle from '../../components/sectiontitle';
import Breadcrumbs from '../../components/breadcrumbs';
import TabsList from '../../components/tablist';

import { useMall } from '../../hooks/Mall';
import { useSession } from '../../hooks/Session';

const Loan = () => {
  const { verifyPermission, validateMalls } = useSession();
  const { mallId } = useMall();

  const [selectedTab, setSelectedTab] = useState('new-occurrence');

  useEffect(() => {
    validateMalls(Object.values(permissions));
  }, [validateMalls]);

  const handlerTab = useCallback(selectedOption => {
    setSelectedTab(selectedOption);
  }, []);

  const renderSection = useCallback(() => {
    if (selectedTab === 'new-occurrence') {
      return <SectionNewOccurrence />;
    }

    if (selectedTab === 'edition') {
      return <SectionEdition />;
    }

    if (selectedTab === 'control') {
      return <SectionControl />;
    }

    if (selectedTab === 'report') {
      return <SectionReport />;
    }
    return <></>;
  }, [selectedTab]);

  const tabsData = useMemo(
    () => [
      ...(verifyPermission(mallId, permissions.LOAN_CREATE)
        ? [
            {
              title: 'Novo Registro',
              icon: '/icons/tab-icons/add.svg',
              value: 'new-occurrence',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.LOAN_REPORT)
        ? [
            {
              title: 'Relatório',
              icon: '/icons/tab-icons/report.svg',
              value: 'report',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.LOAN_LIST)
        ? [
            {
              title: 'Controle',
              icon: '/icons/tab-icons/control.svg',
              value: 'control',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.LOAN_CREATE_LOAN_ITEM)
        ? [
            {
              title: 'Itens',
              icon: '/icons/tab-icons/edit.svg',
              value: 'edition',
            },
          ]
        : []),
    ],
    [verifyPermission, mallId]
  );

  return (
    <>
      <SectionTitle title="Empréstimo" />
      <Breadcrumbs sections={['Home', 'Empréstimo']} />
      {tabsData.length > 0 ? (
        <>
          <TabsList
            data={tabsData}
            handler={handlerTab}
            selectedTab={selectedTab}
          />
          <div className="content">
            <Container>{renderSection()}</Container>
          </div>
        </>
      ) : (
        <div className="no-authorization">
          <h5>Sem autorização</h5>
        </div>
      )}
    </>
  );
};

export default Loan;
