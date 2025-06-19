'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Only use useSession on client side
  const { data: sessionData, status: sessionStatus } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setSession(sessionData);
      setStatus(sessionStatus);
    }
  }, [sessionData, sessionStatus, isClient]);

  return {
    session: isClient ? session : null,
    status: isClient ? status : 'loading',
    isClient
  };
} 