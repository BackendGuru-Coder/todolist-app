import React, { useState } from 'react';
import {
  TextField, Button, List, ListItem, ListItemText,
  IconButton, Stack, Typography, Box, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TodoList = ({ tasks, onAdd, onToggle, onRemove }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!input.trim()) {
      setError('Digite uma tarefa!');
      return;
    }
    const success = onAdd(input);
    if (success) {
      setInput('');
      setError('');
    }
  };

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        label="Nova Tarefa"
        value={input}
        onChange={e => setInput(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleAdd}
        fullWidth
        sx={{ mb: 3, textTransform: 'none', borderRadius: 2 }}
      >
        ➕ Adicionar
      </Button>

      <List>
        {tasks.map(task => (
          <ListItem
            key={task.id}
            disableGutters
            sx={{
              mb: 1,
              bgcolor: '#fafafa',
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': { bgcolor: '#f5f5f5' },
              px: 2,
            }}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => onToggle(task.id)}>
                  {task.completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </IconButton>
                <IconButton onClick={() => onRemove(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <Box sx={{ pr: 10, overflowWrap: 'break-word' }}> {/* espaço reservado pros botões */}
              <Typography variant="caption" color="textSecondary">
                ID: {task.id}
              </Typography>
              <Typography
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'gray' : 'text.primary',
                  fontSize: '1rem',
                  fontWeight: 500,
                  wordBreak: 'break-word',
                }}
              >
                {task.text}
              </Typography>
              <Chip
                label={task.completed ? 'Concluída ✅' : 'Pendente ⏳'}
                color={task.completed ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TodoList;
