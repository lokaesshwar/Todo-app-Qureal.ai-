import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, addTodo, updateTodo, toggleCompleted, deleteTodo } from '../lib/directus';
import { message } from 'antd';

export function useTodos() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      message.success('Todo added');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => message.error(err.message),
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      message.success('Todo updated');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => message.error(err.message),
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: toggleCompleted,
    onSuccess: () => {
      message.success('Todo status updated');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => message.error(err.message),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      message.success('Todo deleted');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => message.error(err.message),
  });

  return {
    todos: data?.data || [],
    isLoading,
    isError,
    error,
    addTodoMutation,
    updateTodoMutation,
    toggleCompletedMutation,
    deleteTodoMutation,
  };
}
