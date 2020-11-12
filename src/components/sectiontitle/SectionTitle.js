import React from 'react';
import { Row, Col } from 'react-bootstrap';

const SectionTitle = props => (
  <Row>
    <Col id="page-title-container">
      <h1 className="page-title">{props.title}</h1>
    </Col>
  </Row>
);

export default SectionTitle;
