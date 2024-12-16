import axios from 'axios';

const API_URL = "http://my-local-cluster/api/todos";

export const getTodos = () => axios.get(API_URL);
export const getColor = () => axios.get(`${API_URL}/color`);
export const createTodo = (todo) => axios.post(API_URL, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
