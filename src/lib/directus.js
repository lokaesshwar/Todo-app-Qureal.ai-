const API_URL = 'https://testapi.qureal.com/items/todo';
const BEARER_TOKEN = 'r-U6mHEWJQ3FTIOJSAMN9Z6pfY8e3F63';

const headers = {
  Authorization: `Bearer ${BEARER_TOKEN}`,
  Accept: '*/*',
  'Content-Type': 'application/json',
};

export const fetchTodos = async () => {
  const res = await fetch(API_URL, { headers });
  if (!res.ok) throw new Error(`Error fetching todos: ${res.status}`);
  return res.json();
};

export const addTodo = async (newTodo) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(newTodo),
  });
  if (!res.ok) throw new Error(`Error adding todo: ${res.status}`);
  return res.json();
};

export const updateTodo = async ({ id, title, content }) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error(`Error updating todo: ${res.status}`);
  return res.json();
};

export const toggleCompleted = async ({ id, is_completed }) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ is_completed: !is_completed }),
  });
  if (!res.ok) throw new Error(`Error updating todo: ${res.status}`);
  return res.json();
};

export const deleteTodo = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error(`Error deleting todo: ${res.status}`);
  return res.json();
};
