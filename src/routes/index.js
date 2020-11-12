import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sac from '../pages/sac';
import Loan from '../pages/loan';
import Coalition from '../pages/coalition';
import EmailBuilder from '../pages/emailBuilder';
import Storekeeper from '../pages/storekeeper';
import RegisterSessionData from '../pages/register';
import LostFound from '../pages/lost-found';

import ContextProvider from '../hooks';

const Routes = () => {
  useEffect(() => {
    const session = sessionStorage.getItem('sessionSpot');
    console.log('Sessao', JSON.parse(session));
  }, []);

  return (
    <Switch>
      <ContextProvider>
        <Route path="/sac" component={Sac} />
        <Route path="/loan" component={Loan} />
        <Route path="/lostfound" component={LostFound} />
        <Route path="/register" component={RegisterSessionData} />
        <Route path="/coalition" component={Coalition} />
        <Route path="/storekeeper" component={Storekeeper} />
        <Route path="/emailBuilder" component={EmailBuilder} />
      </ContextProvider>
    </Switch>
  );
};

export default Routes;
