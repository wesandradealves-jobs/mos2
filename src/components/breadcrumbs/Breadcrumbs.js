import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Breadcrumbs = props => (
  <Row>
    <Col id="breadcrumbs-container">
      <div className="wrapper-breadcrumbs">
        <ol className="breadcrumbs">
          <li className="item">{props.sections[0]}</li>
          <li className="item">{props.sections[1]}</li>
        </ol>
      </div>
    </Col>
  </Row>
);

export default Breadcrumbs;
