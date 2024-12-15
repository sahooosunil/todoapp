import React, { useState, useEffect } from "react";
import { getTodos, createTodo, deleteTodo, getColor } from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await getTodos();
    const color = await getColor();
    setColor(color.data);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const response = await createTodo({ title: newTodo, completed: false });
      setTodos([...todos, response.data]);
      setNewTodo("");
    }
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>To-Do App</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p style={{backgroundColor: color, display: "inline"}}>color: <span >{color}</span></p>
    </div>
  );
}

export default App;
