import authConfig from "../../../shared/auth.json";

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  fallbackErrorMessage?: string;
  unauthorizedMessage?: string;
  handleUnauthorized?: boolean;
}

let unauthorizedHandler: (() => void) | null = null;

function getErrorMessage(data: unknown, fallbackErrorMessage: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string" &&
    data.error
  ) {
    return data.error;
  }

  return fallbackErrorMessage;
}

async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export async function apiRequest<TResponse>(
  path: string,
  {
    method = "GET",
    body,
    headers,
    fallbackErrorMessage = "Request failed",
    unauthorizedMessage = authConfig.messages.sessionExpired,
    handleUnauthorized = true,
  }: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(path, {
    method,
    credentials: "include",
    headers: body
      ? {
          "Content-Type": "application/json",
          ...headers,
        }
      : headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await readJson(response);

  if (response.status === 401) {
    if (handleUnauthorized) {
      unauthorizedHandler?.();
      throw new Error(unauthorizedMessage);
    }

    throw new Error(getErrorMessage(data, unauthorizedMessage));
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackErrorMessage));
  }

  return data as TResponse;
}

export async function apiRequestOrNull<TResponse>(
  path: string,
  options?: Omit<ApiRequestOptions, "handleUnauthorized">,
): Promise<TResponse | null> {
  const response = await fetch(path, {
    method: options?.method ?? "GET",
    credentials: "include",
    headers: options?.body
      ? {
          "Content-Type": "application/json",
          ...options.headers,
        }
      : options?.headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    return null;
  }

  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, options?.fallbackErrorMessage ?? "Request failed"),
    );
  }

  return data as TResponse;
}
