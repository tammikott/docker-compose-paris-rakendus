import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await axios.post('/api/todos', {
        title: newTitle,
        description: newDescription
      });
      setTodos([response.data, ...todos]);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const response = await axios.put(`/api/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === todo.id ? response.data : t));
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="loading">otammik: Loading...</div>;

  return (
    <div className="App">
      <header>
        <h1>Tere tulemast!</h1>
        <p>Docker Compose Lab - otammik</p>
      </header>
      
      <div className="container">
        <form onSubmit={addTodo} className="todo-form">
          <h2>Add New Todo</h2>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows="3"
          />
          <button type="submit">Add Todo</button>
        </form>

        <div className="todos-section">
          <h2>My Todos ({todos.length})</h2>
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet! Start by adding one above.</p>
          ) : (
            <div className="todos-list">
              {todos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <div className="todo-content">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                  <button onClick={() => deleteTodo(todo.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
