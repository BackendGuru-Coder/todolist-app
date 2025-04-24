import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import axios from 'axios';
import { Container, Typography, Button, Box } from '@mui/material';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showCompleted, setShowCompleted] = useState(false);

  const API_URL = 'http://localhost:3001/tasks';

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        const formatted = res.data.map(task => ({
          ...task,
          id: String(task.id) // <-- ID como string
        }));
        setTasks(formatted);
        setNextId(formatted.length > 0
          ? Math.max(...formatted.map(t => Number(t.id))) + 1
          : 1);
      });
  }, []);

  const addTask = async (text) => {
    if (!text.trim()) return false;
    const newTask = { id: String(nextId), text, completed: false }; // ID como string
    await axios.post(API_URL, newTask);
    setTasks(prev => [...prev, newTask]);
    setNextId(prev => prev + 1);
    return true;
  };

  const toggleTask = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
  
      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };
  
      await axios.put(`${API_URL}/${id}`, updatedTask);
  
      setTasks(prev =>
        prev.map(task => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Erro ao alternar status da tarefa:', error);
    }
  };
  
  const removeTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#fff',
          padding: 4,
          borderRadius: 3,
          boxShadow: 6,
          width: '100%',
          height: 'auto',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: '#333' }} // Título visível e escuro
        >
          📋 Lista de Tarefas
        </Typography>

        <TodoList
          tasks={
            [...(showCompleted ? tasks.filter(t => t.completed) : tasks)]
              .sort((a, b) => b.id - a.id) // <-- ordenação por ID
          }
          onAdd={addTask}
          onToggle={toggleTask}
          onRemove={removeTask}
        />

        <Button
          variant="outlined"
          onClick={() => setShowCompleted(!showCompleted)}
          fullWidth
          sx={{
            mt: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#f0f0f0'
            }
          }}
        >
          {showCompleted ? 'Mostrar Todas as Tarefas' : 'Mostrar Concluídas'}
        </Button>
      </Container>
    </Box>
  );
};

export default App;
