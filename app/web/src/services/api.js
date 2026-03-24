const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request(path, options = {}, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(payload.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path, token) => request(path, { method: 'GET' }, token),
  post: (path, body, token) =>
    request(
      path,
      {
        method: 'POST',
        body: JSON.stringify(body)
      },
      token
    ),
  put: (path, body, token) =>
    request(
      path,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      },
      token
    ),
  delete: (path, token) => request(path, { method: 'DELETE' }, token)
};
