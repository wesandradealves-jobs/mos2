import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import TagManager from 'react-gtm-module';
import './config/charts';

import Routes from './routes';

const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_TAG,
};

TagManager.initialize(tagManagerArgs);

class App extends React.Component {
  render() {
    return (
      <Container className="container-sac">
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Container>
    );
  }
}

export default App;
