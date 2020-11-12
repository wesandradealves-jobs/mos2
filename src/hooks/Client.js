import React, { createContext, useState, useContext, useCallback } from 'react';

import ApiClient from '../services/api';

const api = new ApiClient();

const ClientContext = createContext({});

export const ClientProvider = ({ children }) => {
  const [clientCpf, setClientCpf] = useState('');
  const [client, setClient] = useState({});

  const fetchClient = useCallback(
    async (cpf, mallId) => {
      if (cpf === clientCpf) {
        try {
          const customer = await api.getCustomer(mallId, cpf);

          setClient({ ...customer, cpf: clientCpf });
        } catch {
          setClient({});
          setClientCpf('');
          throw new Error('CPF not found');
        }
      } else {
        setClient({});
        setClientCpf('');
        throw new Error('CPF is out of date');
      }
    },
    [clientCpf]
  );

  return (
    <ClientContext.Provider
      value={{ clientCpf, setClientCpf, client, fetchClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export function useClient() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClient must be used within an ClientProvider');
  }
  return context;
}
