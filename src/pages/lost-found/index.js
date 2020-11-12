import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container } from 'react-bootstrap';

import permissions from '../../config/permissions';

import SectionControl from './sections/section-control';
import SectionNewOccurrence from './sections/section-new-occurrence';
import SectionReport from './sections/section-report';
import SectionTitle from '../../components/sectiontitle';
import Breadcrumbs from '../../components/breadcrumbs';
import TabsList from '../../components/tablist';

import { useSession } from '../../hooks/Session';
import { useMall } from '../../hooks/Mall';

const LostFound = () => {
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
      ...(verifyPermission(mallId, permissions.LOSTFOUND_CREATE)
        ? [
            {
              title: 'Novo Registro',
              icon: '/icons/tab-icons/add.svg',
              value: 'new-occurrence',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.LOSTFOUND_REPORT)
        ? [
            {
              title: 'Relatório',
              icon: '/icons/tab-icons/control.svg',
              value: 'report',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.LOSTFOUND_LIST)
        ? [
            {
              title: 'Controle',
              icon: '/icons/tab-icons/control.svg',
              value: 'control',
            },
          ]
        : []),
    ],
    [verifyPermission, mallId]
  );

  return (
    <>
      <SectionTitle title="Achados e Perdidos" />
      <Breadcrumbs sections={['Home', 'Achados e Perdidos']} />
      {tabsData.length > 0 ? (
        <>
          <TabsList
            data={tabsData}
            handler={handlerTab}
            selectedTab={selectedTab}
          />
          <div className="content" style={{ minWidth: '1000px' }}>
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

export default LostFound;
