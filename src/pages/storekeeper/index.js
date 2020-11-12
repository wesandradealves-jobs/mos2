import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import permissions from '../../config/permissions';

import SectionTitle from '../../components/sectiontitle';
import Breadcrumbs from '../../components/breadcrumbs';
import TabsList from '../../components/tablist';

import SectionExtract from './sections/section-extract';
import SectionConciliation from './sections/section-conciliation';
import SectionTransference from './sections/section-transference';

import Mock from '../../mocks/storekeeper';

import { useSession } from '../../hooks/Session';
import { useMall } from '../../hooks/Mall';

const mock = new Mock();

const StoreKeeper = () => {
  const { verifyPermission, validateMalls } = useSession();
  const { mallId } = useMall();

  const [selectedTab, setSelectedTab] = useState('extract');

  useEffect(() => {
    validateMalls(Object.values(permissions));
  }, [validateMalls]);

  const handlerTab = useCallback(selectedOption => {
    setSelectedTab(selectedOption);
  }, []);

  const renderSection = useCallback(() => {
    if (selectedTab === 'extract') {
      return <SectionExtract mock={mock} />;
    }
    if (selectedTab === 'conciliation') {
      return <SectionConciliation mock={mock} />;
    }
    if (selectedTab === 'transfer') {
      return <SectionTransference mock={mock} />;
    }
    return <></>;
  }, [selectedTab]);

  const tabsData = useMemo(
    () => [
      ...(verifyPermission(mallId, permissions.STOREKEEPER_STATEMENT)
        ? [
            {
              title: 'EXTRATO',
              icon: '/icons/tab-icons/control.svg',
              value: 'extract',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.STOREKEEPER_CONCILIATION)
        ? [
            {
              title: 'CONCILIAÇÃO',
              icon: '/icons/tab-icons/report.svg',
              value: 'conciliation',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.STOREKEEPER_TRANSFER)
        ? [
            {
              title: 'TRANSFERÊNCIA',
              icon: '/icons/tab-icons/transfer.svg',
              value: 'transfer',
            },
          ]
        : []),
    ],
    [verifyPermission, mallId]
  );

  return (
    <>
      <SectionTitle title="LOJISTA" />
      <Breadcrumbs sections={['Home', 'Lojista']} />
      {tabsData.length > 0 ? (
        <>
          <TabsList
            data={tabsData}
            handler={handlerTab}
            selectedTab={selectedTab}
          />
          <div className="content">
            <Container>
              <Row>
                <Col>
                  <section>{renderSection()}</section>
                </Col>
              </Row>
            </Container>
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

export default StoreKeeper;
