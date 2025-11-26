const BASE_URL = 'https://dummyjson.com';

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Something went wrong, please try again.';
    throw new Error(message);
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

export const registerUser = async (data) => {
  const response = await fetch(`${BASE_URL}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      role: data?.role || 'user',
    }),
  });

  return handleResponse(response);
};

