import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import axios from 'axios';
import { Container, Typography, Button, Box } from '@mui/material';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(res => {
        const formatted = res.data.map((t, index) => ({
          id: index + 1,
          text: t.title,
          completed: t.completed
        }));
        setTasks(formatted);
        setNextId(res.data.length + 1);
      })
      .catch(err => console.error(err));
  }, []);

  const addTask = (text) => {
    if (!text.trim()) return false;
    const newTask = {
      id: nextId,
      text,
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNextId(prev => prev + 1);
    return true;
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const removeTask = (id) => {
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
