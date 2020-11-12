import React from 'react';

import { ClientProvider } from './Client';
import { MallProvider } from './Mall';
import { SessionProvider } from './Session';

const ContextProvider = ({ children }) => (
  <SessionProvider>
    <MallProvider>
      <ClientProvider>{children}</ClientProvider>
    </MallProvider>
  </SessionProvider>
);

export default ContextProvider;
