import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import permissions from '../../config/permissions';

import SectionTitle from '../../components/sectiontitle';
import Breadcrumbs from '../../components/breadcrumbs';
import TabsList from '../../components/tablist';
import ClientSideHeader from '../../components/client-side-header';

import { useMall } from '../../hooks/Mall';
import { useSession } from '../../hooks/Session';

import SectionNewNote from './sections/section-new-note';
import SectionBenefits from './sections/section-benefits';
import SectionExtract from './sections/section-extract';
import SectionNewClient from './sections/section-new-client';
import SectionControl from './sections/section-control';

const Coalition = () => {
  const { verifyPermission, validateMalls } = useSession();
  const { mallId } = useMall();

  const clientSideHeaderRef = useRef();

  useEffect(() => {
    validateMalls(Object.values(permissions));
  }, [validateMalls]);

  const [selectedTab, setSelectedTab] = useState('new-note');

  const handlerTab = useCallback(selectedOption => {
    setSelectedTab(selectedOption);
  }, []);

  const handleSectionSubmit = useCallback(() => {
    clientSideHeaderRef.current.loadClient();
  }, []);

  const renderSection = useCallback(() => {
    if (selectedTab === 'new-note') {
      return <SectionNewNote onSubmit={handleSectionSubmit} />;
    }
    if (selectedTab === 'benefits') {
      return <SectionBenefits onSubmit={handleSectionSubmit} />;
    }
    if (selectedTab === 'extract') {
      return <SectionExtract />;
    }
    if (selectedTab === 'new-client') {
      return <SectionNewClient />;
    }
    return <></>;
  }, [handleSectionSubmit, selectedTab]);

  const tabsData = useMemo(
    () => [
      ...(verifyPermission(mallId, permissions.COALITION_TAB_CREATE_TRANSACTION)
        ? [
            {
              title: 'Inserir Nota',
              icon: '/icons/tab-icons/notas.svg',
              value: 'new-note',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.COALITION_TAB_REDEEM_BENEFIT)
        ? [
            {
              title: 'Benefício',
              icon: '/icons/tab-icons/coalizao.svg',
              value: 'benefits',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.COALITION_TAB_VIEW_STATEMENT)
        ? [
            {
              title: 'Extrato',
              icon: '/icons/tab-icons/control.svg',
              value: 'extract',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.COALITION_TAB_CREATE_CLIENT)
        ? [
            {
              title: 'Novo Cliente',
              icon: '/icons/tab-icons/add.svg',
              value: 'new-client',
            },
          ]
        : []),
      ...(verifyPermission(mallId, permissions.COALITION_TAB_CONFIG)
        ? [
            {
              title: 'Configurações',
              icon: '/icons/tab-icons/configuracoes_abas-01.svg',
              value: 'control',
            },
          ]
        : []),
    ],
    [verifyPermission, mallId]
  );

  return (
    <>
      <SectionTitle title="COALIZÃO" />
      <Breadcrumbs sections={['Home', 'Coalizão']} />
      {tabsData.length > 0 ? (
        <>
          <TabsList
            data={tabsData}
            handler={handlerTab}
            selectedTab={selectedTab}
          />
          <div className="content">
            <Container>
              {selectedTab === 'control' ? (
                <SectionControl style={{ marginLeft: 20, marginRight: 20 }} />
              ) : (
                <Row>
                  <Col md={12} lg={4}>
                    <ClientSideHeader
                      ref={clientSideHeaderRef}
                      mallId={mallId}
                    />
                  </Col>
                  <Col md={12} lg={8}>
                    <section style={{ marginLeft: 20, marginRight: 20 }}>
                      {renderSection()}
                    </section>
                  </Col>
                </Row>
              )}
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

export default Coalition;
