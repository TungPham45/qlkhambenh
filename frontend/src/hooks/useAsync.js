import { useCallback, useState } from "react";

export function useAsync(callback) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      return await callback(...args);
    } catch (caught) {
      setError(caught);
      throw caught;
    } finally {
      setLoading(false);
    }
  }, [callback]);

  return { execute, loading, error };
}
