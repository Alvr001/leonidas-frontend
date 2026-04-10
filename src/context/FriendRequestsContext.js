import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getFriendRequests, getFriends } from '../services/api';

const FriendRequestsContext = createContext();

export function FriendRequestsProvider({ children, userId }) {

  const [pendingCount, setPendingCount] = useState(() =>
    parseInt(localStorage.getItem(`pendingCount_${userId}`) || '0')
  );
  const [seen, setSeen] = useState(() =>
    // 🔥 si no hay clave, asumimos visto (true) para no mostrar punto fantasma
    localStorage.getItem(`notifSeen_${userId}`) !== 'false'
  );
  const [hasNewFriend, setHasNewFriend] = useState(() =>
    localStorage.getItem(`hasNewFriend_${userId}`) === 'true'
  );

  const lastFriendCount  = useRef(null);
  const lastPendingCount = useRef(null);

  const markAsSeen = useCallback(() => {
    setSeen(true);
    localStorage.setItem(`notifSeen_${userId}`, 'true');
  }, [userId]);

  const markAcceptedSeen = useCallback(() => {
    setHasNewFriend(false);
    localStorage.removeItem(`hasNewFriend_${userId}`);
  }, [userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const reqRes = await getFriendRequests(userId);
      const newPending = reqRes.data.length;

      if (lastPendingCount.current === null) {
        // Primera carga
        lastPendingCount.current = newPending;
        setPendingCount(newPending);
        localStorage.setItem(`pendingCount_${userId}`, String(newPending));

        if (newPending === 0) {
          // Sin solicitudes → limpiar punto
          setSeen(true);
          localStorage.setItem(`notifSeen_${userId}`, 'true');
        }
        // Si hay solicitudes, el seen ya viene de localStorage — no tocarlo
      } else if (newPending > lastPendingCount.current) {
        // Nueva solicitud llegó
        lastPendingCount.current = newPending;
        setPendingCount(newPending);
        localStorage.setItem(`pendingCount_${userId}`, String(newPending));
        setSeen(false);
        localStorage.setItem(`notifSeen_${userId}`, 'false'); // 🔥 'false' como string
      } else {
        lastPendingCount.current = newPending;
        setPendingCount(newPending);
        localStorage.setItem(`pendingCount_${userId}`, String(newPending));
        if (newPending === 0) {
          // Se resolvieron todas → limpiar punto
          setSeen(true);
          localStorage.setItem(`notifSeen_${userId}`, 'true');
        }
      }

      const friendsRes = await getFriends(userId);
      const newFriendCount = friendsRes.data.length;

      if (lastFriendCount.current === null) {
        lastFriendCount.current = newFriendCount;
        // hasNewFriend ya viene de localStorage, no pisarlo
      } else if (newFriendCount > lastFriendCount.current) {
        lastFriendCount.current = newFriendCount;
        setHasNewFriend(true);
        localStorage.setItem(`hasNewFriend_${userId}`, 'true');
      } else {
        lastFriendCount.current = newFriendCount;
      }

    } catch {}
  }, [userId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <FriendRequestsContext.Provider value={{
      pendingCount, seen, markAsSeen,
      hasNewFriend, markAcceptedSeen,
      refresh,
    }}>
      {children}
    </FriendRequestsContext.Provider>
  );
}

export const usePendingRequests = () => {
  const ctx = useContext(FriendRequestsContext);
  return {
    ...ctx,
    pendingCount: ctx.seen ? 0 : ctx.pendingCount,
  };
};