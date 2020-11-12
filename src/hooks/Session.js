import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import mock from '../mocks/session';
import PopUp from '../utils/PopUp';

const popUp = new PopUp();

const SessionContext = createContext({});

export const SessionProvider = ({ children }) => {
  const [sessionSpot] = useState(() => {
    const session = process.env.NODE_ENV === 'development' ? mock : null;

    return sessionStorage.getItem('sessionSpot')
      ? JSON.parse(JSON.parse(sessionStorage.getItem('sessionSpot')))
      : session;
  });

  useEffect(() => {
    !sessionSpot &&
      popUp.showWarning(
        'Não foi possível obter a sessão do usuário. Verifique a conexão de rede e atualize seu navegador.'
      );
  }, [sessionSpot]);

  const [malls, setMalls] = useState(() =>
    sessionSpot ? sessionSpot.malls : []
  );

  const verifyPermission = useCallback(
    (mallId, code) => {
      try {
        const mallFound = sessionSpot.user.malls.find(
          mall => mall.id.toString() === mallId.toString()
        );
        const permissionFound = mallFound.role.permissions.find(
          p => p.code === code
        );
        return !!permissionFound;
      } catch {
        return false;
      }
    },
    [sessionSpot]
  );

  const employee = useMemo(
    () =>
      sessionSpot && sessionSpot.user
        ? { id: sessionSpot.user.id, name: sessionSpot.user.name }
        : null,
    [sessionSpot]
  );

  const resetMalls = useCallback(() => {
    sessionSpot && setMalls(sessionSpot.malls);
  }, [sessionSpot]);

  const validateMalls = useCallback(
    codes => {
      try {
        setMalls(
          sessionSpot.user.malls.filter(
            mall =>
              mall.role.permissions.findIndex(p => {
                return codes.indexOf(p.code) !== -1;
              }) !== -1
          )
        );
      } catch {
        resetMalls();
      }
    },
    [resetMalls, sessionSpot]
  );

  return (
    <SessionContext.Provider
      value={{
        sessionSpot,
        verifyPermission,
        employee,
        malls,
        validateMalls,
        resetMalls,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
}
