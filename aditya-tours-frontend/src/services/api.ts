const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

function getAdminToken() {
  return localStorage.getItem('aditya_admin_token') || '';
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { authenticated = false, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Content-Type', 'application/json');
  if (authenticated) {
    requestHeaders.set('Authorization', `Bearer ${getAdminToken()}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new ApiError(payload?.error?.code || 'API_ERROR', payload?.error?.message || 'Something went wrong');
  }

  return payload.data as T;
}
