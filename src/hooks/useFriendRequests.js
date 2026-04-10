import { useState, useEffect, useCallback } from 'react';
import { getFriendRequests } from '../services/api';

export function useFriendRequests(userId) {
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getFriendRequests(userId);
      setPendingCount(res.data.length);
    } catch {}
  }, [userId]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { pendingCount, refresh };
}