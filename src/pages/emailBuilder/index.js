import React, { useRef, useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EmailEditor from 'react-email-editor';
import { Row, Col, Container } from 'react-bootstrap';

import ApiClient from '../../services/api';

const api = new ApiClient();

const popUp = withReactContent(Swal);

const EmailBuilder = () => {
  const [subject, setSubject] = useState('');
  const [emailId, setEmailId] = useState();

  let editorRef = useRef(null);

  useEffect(() => {
    function messageHandler(event) {
      const { action, key, value } = event.data;
      if (action === 'loadEmail' && key === 'emailId' && value && editorRef) {
        api.getEmail(value).then(email => {
          if (email) {
            editorRef.loadDesign(JSON.parse(email.metadata));
            setSubject(email.subject);
            setEmailId(value);
          }
        });
      }
    }
    window.addEventListener('message', messageHandler, false);
  }, []);

  const handleSubjectChange = useCallback(event => {
    setSubject(event.target.value);
  }, []);

  const handleNewEmail = useCallback(() => {
    if (editorRef) {
      editorRef.saveDesign();
      editorRef.exportHtml(data => {
        const { design, html } = data;
        api
          .createEmail({
            subject,
            content: html,
            metadata: JSON.stringify(design),
          })
          .then(email => {
            setEmailId(email.id);
            window.parent.postMessage(
              {
                action: 'handleEmail',
                key: 'create',
                value: email.id,
              },
              '*'
            );
          })
          .catch(() =>
            window.parent.postMessage(
              {
                action: 'handleEmail',
                key: 'error',
                value: null,
              },
              '*'
            )
          );
      });
    }
  }, [subject]);

  const handleUpdateEmail = useCallback(() => {
    if (emailId && editorRef) {
      editorRef.saveDesign();
      editorRef.exportHtml(data => {
        const { design, html } = data;
        api
          .updateEmail(emailId, {
            subject,
            content: html,
            metadata: JSON.stringify(design),
          })
          .then(email => {
            window.parent.postMessage(
              {
                action: 'handleEmail',
                key: 'update',
                value: email.id,
              },
              '*'
            );
          })
          .catch(() =>
            window.parent.postMessage(
              {
                action: 'handleEmail',
                key: 'error',
                value: null,
              },
              '*'
            )
          );
      });
    }
  }, [emailId, subject]);

  const handleDeleteEmail = useCallback(() => {
    if (emailId) {
      popUp
        .fire({
          text: 'Deseja excluir o e-mail?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'SIM',
          cancelButtonText: 'NÃO',
        })
        .then(result => {
          if (result.value) {
            api
              .deleteEmail(emailId)
              .then(() => {
                window.parent.postMessage(
                  {
                    action: 'handleEmail',
                    key: 'delete',
                    value: null,
                  },
                  '*'
                );
              })
              .catch(() =>
                window.parent.postMessage(
                  {
                    action: 'handleEmail',
                    key: 'error',
                    value: null,
                  },
                  '*'
                )
              );
          }
        });
    }
  }, [emailId]);

  const onLoad = async () => {
    if (editorRef) {
      editorRef.setMergeTags({
        FULL_NAME: {
          name: 'Nome Completo',
          value: '%FULL_NAME%',
        },
        SHORT_NAME: {
          name: 'Primeiro e Último nome',
          value: '%SHORT_NAME%',
        },
        FIRST_NAME: {
          name: 'Primeiro Nome',
          value: '%FIRST_NAME%',
        },
        CURRENT_SEGMENT: {
          name: 'Segmento atual do Cliente',
          value: '%CURRENT_SEGMENT%',
        },
        NEXT_SEGMENT: {
          name: 'Próximo segmento Cliente',
          value: '%NEXT_SEGMENT%',
        },
        SUMIDX: {
          name: 'Sumidx',
          value: '%SUMIDX%',
        },
        LAST_TRANSACTION_POINTS: {
          name: 'X pontos da última transação',
          value: '%LAST_TRANSACTION_POINTS%',
        },
        MALL_NAME: {
          name: 'Nome do Shopping',
          value: '%MALL_NAME%',
        },
        LAST_OFFER_PUSH: {
          name: 'Último push enviado',
          value: '%LAST_OFFER_PUSH%',
        },
      });
    }
  };

  return (
    <>
      <Container className="emailBuilder">
        <Row className="row-margin">
          <Col>
            <h2 className="header">E-MAIL MARKETING</h2>
          </Col>
        </Row>
        <Row className="row-margin">
          <Col>
            <input
              type="text"
              placeholder="Assunto do E-mail"
              onChange={handleSubjectChange}
              value={subject}
            />
          </Col>
        </Row>
        <Row className="row-margin">
          <Col>
            <div className="editorborder">
              <div className="emailBuilderShow">
                <EmailEditor
                  projectId={5374}
                  options={{
                    customCSS: [
                      `.u_body {
                    padding: 2px;
                  }`,
                      `.sc-fzoydu {
                    padding: 2px !important;
                    min-height: 100vh !important;
                  }`,
                      `.sc-fzoYHE {
                    border-left: 1px solid #54bbab !important;
                  }`,
                      `.blockbuilder-placeholder:before {
                      background-color: #54bbab !important;
                  }`,
                      `.blockbuilder-placeholder:after {
                    outline-color: #54bbab !important
                  }`,
                      `.gJohPa {
                    background-color: #54bbab !important;
                  }`,
                      `.cCBoNK .btn-primary {
                    background-color: #54bbab !important;
                  }`,
                      `.blockbuilder-placeholder-empty {
                    outline-color: #4f7872 !important;
                    color: #4f7872 !important;
                    background-color: #cbe6e1 !important;
                  }`,
                      `.nav-icon svg {
                    color: #563062 !important;
                  }`,
                      `.nav-name {
                    color: #563062 !important;
                  }`,
                      `.blockbuilder-content-tool-icon svg {
                    color: #563062 !important;
                  }`,
                      `div.blockbuilder-content-tool-name {
                    color: #563062 !important;
                  }`,
                      `.blockbuilder-layer-drag {
                    background-color: #54bbab !important;
                  }`,
                      `.blockbuilder-layer-control {
                    background-color: #54bbab !important;
                  }`,
                      `.blockbuilder-layer.blockbuilder-layer-selected > .blockbuilder-layer-selector:after {
                    outline-color: #54bbab !important
                  }`,
                      `.nav-item:nth-child(4) {
                    display: none;
                  }`,
                      `.ha-DKUY {
                    border-bottom-color: rgba(84, 187, 171, 0.3);
                  }`,
                      `.ha-DKUY hr {
                    border-top-color: rgba(84, 187, 171, 0.3);
                  }`,
                      `.react-toggle--checked .react-toggle-thumb {
                    border-color: #54bbab !important;
                    border-top-color: #54bbab !important;
                    border-right-color: #54bbab !important;
                    border-bottom-color: #54bbab !important;
                    border-left-color: #54bbab !important;
                  }`,
                      `.react-toggle-thumb {
                    box-shadow: none !important;
                  }`,
                      `.react-toggle-track-check {
                    display: none;
                  }`,
                      `.react-toggle-track-x {
                    display: none;
                  }`,
                      `.react-toggle--checked .react-toggle-track{
                    background-color: #54bbab !important;
                  }`,
                      `.bootstrap .btn {
                    border-color: #54bbab !important;
                  }`,
                      `.col-5 svg {
                    color: #54bbab !important;
                  }`,
                      `.blockbuilder-content-tools {
                    justify-content: start !important;
                  }`,
                      `.blockbuilder-content-tools > div:nth-child(1) {
                    display: none;
                  }`,
                      `.blockbuilder-column {
                    background-color: #fff !important;
                  }`,
                      `.blockbuilder-column::after {
                    outline-color: rgba(84, 187, 171, 0.5) !important;
                  }`,
                      `.sc-fzqMAW .sc-fzqNqU:nth-child(3) {
                    display: none;
                  }`,
                      `.sc-fzqMAW .sc-fzqNqU:nth-child(4) {
                    display: none;
                  }`,
                      `.sc-fzqMAW .sc-fzqNqU:nth-child(5) {
                    display: none;
                  }`,
                      `.col-12 .input-group:last-child(2) {
                    display: none !important;
                  }`,
                      `.sc-fzqMAW .sc-fzqNqU:first-child .col-8 .btn-group-sm {
                    display: none !important;
                  }`,
                      `.sc-fzqMAW .sc-fzqARJ:nth-child(4) {
                    display: none;
                  }`,
                      `.sc-fzqAbL .sc-fzqARJ:nth-child(2) {
                    display: none;
                  }`,
                      `#u_content_button_1 a {
                    background-color: #54bbab !important;
                  }`,
                      `span.mce-content-body {
                    background-color: #54bbab !important;
                  }`,
                    ],
                    locale: 'pt-BR',
                  }}
                  ref={designer => (editorRef = designer)}
                  onLoad={onLoad}
                  tools={{
                    button: {
                      position: 1,
                    },
                    divider: {
                      position: 2,
                    },
                    html: {
                      position: 3,
                    },
                    image: {
                      position: 4,
                    },
                    text: {
                      position: 5,
                    },
                    timer: {
                      enabled: false,
                    },
                    social: {
                      enabled: false,
                    },
                    video: {
                      enabled: false,
                    },
                  }}
                />
              </div>
              <div className="emailBuilderMinWidth">
                Não é possível usar essa funcionalidade em resolução de tela
                inferior a 1560px de largura
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="email-buttons">
              {!emailId ? (
                <button
                  className="button-default -action -small align-center"
                  onClick={handleNewEmail}
                  disabled={!subject}
                >
                  ADICIONAR
                </button>
              ) : (
                <>
                  <button
                    className="button-default -action -small align-center"
                    onClick={handleUpdateEmail}
                    disabled={!subject}
                    style={{ backgroundColor: '#54bbab' }}
                  >
                    ATUALIZAR
                  </button>
                  <button
                    className="button-default -action -small align-center"
                    onClick={handleDeleteEmail}
                    style={{ backgroundColor: '#9d9e9f' }}
                  >
                    EXCLUIR
                  </button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmailBuilder;
