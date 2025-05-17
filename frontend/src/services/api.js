const BASE_URL = 'http://localhost:5000';

export const api = {
  get: async (url) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
  post: async (url, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  put: async (url, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  delete: async (url) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};