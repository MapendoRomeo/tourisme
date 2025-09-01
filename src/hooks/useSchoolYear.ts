// src/hooks/useSchoolYear.ts
import { useEffect, useState } from 'react';

type Listener = (newValue: string) => void;

const listeners = new Set<Listener>();

function notifyAllListeners(newValue: string) {
  listeners.forEach((listener) => listener(newValue));
}

/**
 * Met à jour l'année scolaire dans localStorage et notifie tous les composants abonnés.
 */
export function setSchoolYearId(newId: string) {
  localStorage.setItem('selectedSchoolYear', newId);
  notifyAllListeners(newId);
}

/**
 * Hook React pour accéder et suivre les modifications de l'année scolaire dans localStorage.
 */
export function useSchoolYear(): string {
  const [schoolYearId, setSchoolYearIdState] = useState<string>(
    () => localStorage.getItem('selectedSchoolYear') || ''
  );

  useEffect(() => {
    const listener: Listener = (newValue: string) => {
      setSchoolYearIdState(newValue);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return schoolYearId;
}
