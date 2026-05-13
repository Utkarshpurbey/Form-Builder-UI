import { useCallback, useMemo, useState } from "react";

export default function useAsyncObject() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const request = useCallback(async (url: string, method: string, body?: any, headers?: any) => {
    setStatus("loading");
    setError(null);
    const sendJsonBody =
      body != null && (method === "POST" || method === "PATCH");
    try {
      const response = await fetch(url, {
        method,
        body: sendJsonBody ? JSON.stringify(body) : undefined,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      const payload = await response.json();
      if (!response.ok || response.status >= 400) {
        throw new Error(payload.message || "An error occurred");
      }
      setData(payload);
      setStatus("success");
      return payload;
    } catch (err) {
      setError(err);
      setData(null);
      setStatus("failed");
    }
  }, []);

  const get = useCallback((url: string, headers?: any) => request(url, "GET", undefined, headers), [request]);
  const post = useCallback((url: string, body?: any, headers?: any) => request(url, "POST", body, headers), [request]);
  const patch = useCallback((url: string, body?: any, headers?: any) => request(url, "PATCH", body, headers), [request]);
  const del = useCallback((url: string, headers?: any) => request(url, "DELETE", undefined, headers), [request]);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isFailed = status === "failed";

  const state = useMemo(
    () => ({
      isLoading,
      isSuccess,
      isFailed,
      data,
      error,
    }),
    [isLoading, isSuccess, isFailed, data, error],
  );

  return {
    isLoading,
    isSuccess,
    isFailed,
    isIdle: status === "idle",
    data,
    error,
    state,
    get,
    post,
    patch,
    delete: del,
    reset,
  };
}
