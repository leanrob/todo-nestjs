'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Todo } from './mocks/todos';
import TodoItem from './components/TodoItem';
import FloatingAddButton from './components/FloatingAddButton';

// Would be moved to an env, but for ease of run will be left here
const API_URL = 'http://localhost:8080/todos';

const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f5f5f5;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const TodoListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 100px;
  role: list;
  aria-label="Todo list"
`;

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(todo => todo.id !== id));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const handleUpdate = async (id: string, updatedFields: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const handleAddNew = async () => {
    const newTodo = {
      title: '',
      description: '',
      completed: false,
      starred: false,
      priority: 'medium' as const,
      tags: [],
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      const createdTodo = await response.json();
      setTodos([createdTodo, ...todos]);
      setEditingId(createdTodo.id);
      setError(null);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  const handleSaveAndAddAnother = async () => {
    try {
      const newTodo = {
        title: '',
        description: '',
        completed: false,
        starred: false,
        priority: 'medium' as const,
        tags: [],
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      const createdTodo = await response.json();
      
      // Add the new todo at the beginning of the list
      setTodos(prevTodos => [createdTodo, ...prevTodos]);
      
      // Set the new todo as the one being edited
      setEditingId(createdTodo.id);
      
      // Clear any errors
      setError(null);

      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'New todo created. Ready for input.';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);

    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  if (isLoading) {
    return (
      <MainContainer>
        <Title>Loading...</Title>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Title>Todo App</Title>
      {error && (
        <div 
          style={{ color: 'red', marginBottom: '1rem' }}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      <TodoListContainer>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            isEditing={todo.id === editingId}
            onEditStart={() => setEditingId(todo.id)}
            onEditCancel={() => setEditingId(null)}
            onSaveAndAddAnother={handleSaveAndAddAnother}
          />
        ))}
      </TodoListContainer>
      <FloatingAddButton 
        onClick={handleAddNew}
        aria-label="Add new todo"
      />
    </MainContainer>
  );
} 