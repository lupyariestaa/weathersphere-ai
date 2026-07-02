/**
 * Fetch wrapper with timeout + a single intelligent retry for transient
 * network failures. Keeps API services free of duplicated boilerplate.
 */
export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchJson<T>(url: string, { timeoutMs = 10000, retries = 1 }: { timeoutMs?: number; retries?: number } = {}): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timer);
      if (!res.ok) {
        throw new ApiError(`Request failed (${res.status})`, res.status);
      }
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        continue;
      }
    }
  }

  if (lastError instanceof Error && lastError.name === "AbortError") {
    throw new ApiError("The request timed out. Please try again.");
  }
  if (lastError instanceof ApiError) throw lastError;
  throw new ApiError("Something went wrong while reaching the weather service.");
}
