import { useCallback, useEffect, useState } from 'react';
import { employeeApi } from '../api/client';

const EMPTY = { data: [], pagination: { page: 1, pages: 1, total: 0, limit: 8 }, stats: { total: 0, Active: 0, Inactive: 0 }, departments: [] };

export default function useEmployees(filters) {
  const [state, setState] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    employeeApi
      .list(filters, controller.signal)
      .then((res) => setState(res))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filters.search, filters.status, filters.department, filters.page, filters.limit, filters.sort, tick]); // eslint-disable-line

  return { ...state, loading, error, refetch };
}
