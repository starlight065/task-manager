export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  fallbackErrorMessage?: string;
  unauthorizedMessage?: string;
  handleUnauthorized?: boolean;
}
