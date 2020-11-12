import React, { createContext, useState, useContext, useMemo } from 'react';
import { useSession } from './Session';

const MallContext = createContext({});

export const MallProvider = ({ children }) => {
  const { malls } = useSession();

  const [mallId, setMallId] = useState(() =>
    malls && malls.length > 0 ? malls[0].id : null
  );

  const isMallWithClub = useMemo(() => {
    return (
      malls &&
      malls.length > 0 &&
      malls.find(mall => mall.id.toString() === mallId.toString()).club
    );
  }, [mallId, malls]);

  return (
    <MallContext.Provider value={{ mallId, setMallId, isMallWithClub }}>
      {children}
    </MallContext.Provider>
  );
};

export function useMall() {
  const context = useContext(MallContext);

  if (!context) {
    throw new Error('useMall must be used within an MallProvider');
  }
  return context;
}
