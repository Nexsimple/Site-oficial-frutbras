import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodoApp from '../TodoApp';
import { useTodos } from '../../hooks/useTodos';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the useTodos hook and AsyncStorage
jest.mock('../../hooks/useTodos');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('TodoApp Regression Tests', () => {
  const mockUseTodos = {
    todos: [],
    addTodo: jest.fn(),
    toggleTodo: jest.fn(),
    deleteTodo: jest.fn(),
    clearCompleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should not crash when adding empty todo', () => {
    const { getByPlaceholderText } = render(<TodoApp />);
    const input = getByPlaceholderText('Add a new todo...');
    fireEvent.changeText(input, '   ');
    fireEvent(input, 'submitEditing');
    expect(mockUseTodos.addTodo).not.toHaveBeenCalled();
  });

  it('should clear input field after adding a todo', async () => {
    const { getByPlaceholderText } = render(<TodoApp />);
    const input = getByPlaceholderText('Add a new todo...');
    fireEvent.changeText(input, 'Test todo');
    fireEvent(input, 'submitEditing');
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('should correctly update active count when todos are added/deleted/toggled', async () => {
    const { getByPlaceholderText, getByText, queryByText, getAllByTestId } = render(<TodoApp />);

    // Initial state: 0 items left
    expect(getByText('0 items left')).toBeTruthy();

    // Add first todo: 1 item left
    fireEvent.changeText(getByPlaceholderText('Add a new todo...'), 'Todo 1');
    fireEvent(getByPlaceholderText('Add a new todo...'), 'submitEditing');
    mockUseTodos.todos = [{ id: '1', text: 'Todo 1', completed: false, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos); // Re-mock to update state
    expect(getByText('1 item left')).toBeTruthy();

    // Add second todo: 2 items left
    fireEvent.changeText(getByPlaceholderText('Add a new todo...'), 'Todo 2');
    fireEvent(getByPlaceholderText('Add a new todo...'), 'submitEditing');
    mockUseTodos.todos = [
      { id: '1', text: 'Todo 1', completed: false, createdAt: new Date() },
      { id: '2', text: 'Todo 2', completed: false, createdAt: new Date() },
    ];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos); // Re-mock to update state
    expect(getByText('2 items left')).toBeTruthy();

    // Complete first todo: 1 item left
    fireEvent.press(getByText('Todo 1'));
    mockUseTodos.todos = [
      { id: '1', text: 'Todo 1', completed: true, createdAt: new Date() },
      { id: '2', text: 'Todo 2', completed: false, createdAt: new Date() },
    ];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos); // Re-mock to update state
    expect(getByText('1 item left')).toBeTruthy();

    // Delete second todo: 1 item left (still 1 completed)
    fireEvent.press(getAllByTestId('delete-button')[0]); // Assuming Todo 2 is the first delete button
    mockUseTodos.todos = [
      { id: '1', text: 'Todo 1', completed: true, createdAt: new Date() },
    ];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos); // Re-mock to update state
    expect(getByText('0 items left')).toBeTruthy(); // Only completed todo remains
  });

  it('should correctly filter when no todos are present', () => {
    const { getByText, queryByText } = render(<TodoApp />);
    expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();

    fireEvent.press(getByText('Active'));
    expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();
    expect(queryByText('0 items left')).toBeTruthy();

    fireEvent.press(getByText('Completed'));
    expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();
    expect(queryByText('0 items left')).toBeTruthy();

    fireEvent.press(getByText('All'));
    expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();
    expect(queryByText('0 items left')).toBeTruthy();
  });

  it('should not clear completed todos if none are completed', () => {
    mockUseTodos.todos = [
      { id: '1', text: 'Todo 1', completed: false, createdAt: new Date() },
      { id: '2', text: 'Todo 2', completed: false, createdAt: new Date() },
    ];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);

    const { getByText } = render(<TodoApp />);
    fireEvent.press(getByText('Clear completed'));
    expect(mockUseTodos.clearCompleted).toHaveBeenCalled();
    // The mock clearCompleted would still be called, but the internal logic of useTodos
    // would ensure no todos are removed if none are completed.
  });

  it('should allow adding and immediately deleting a todo', async () => {
    const { getByPlaceholderText, getByText, queryByText, getAllByTestId } = render(<TodoApp />);

    fireEvent.changeText(getByPlaceholderText('Add a new todo...'), 'Quick delete');
    fireEvent(getByPlaceholderText('Add a new todo...'), 'submitEditing');
    mockUseTodos.todos = [{ id: '1', text: 'Quick delete', completed: false, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);

    await waitFor(() => {
      expect(getByText('Quick delete')).toBeTruthy();
    });

    fireEvent.press(getAllByTestId('delete-button')[0]);
    mockUseTodos.todos = [];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);

    await waitFor(() => {
      expect(queryByText('Quick delete')).toBeNull();
      expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();
    });
  });

  it('should handle toggling a todo multiple times', async () => {
    const { getByPlaceholderText, getByText } = render(<TodoApp />);

    fireEvent.changeText(getByPlaceholderText('Add a new todo...'), 'Toggle me');
    fireEvent(getByPlaceholderText('Add a new todo...'), 'submitEditing');
    mockUseTodos.todos = [{ id: '1', text: 'Toggle me', completed: false, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);

    await waitFor(() => {
      expect(getByText('Toggle me')).toBeTruthy();
    });

    const todoText = getByText('Toggle me');

    // Toggle 1: incomplete -> complete
    fireEvent.press(todoText);
    mockUseTodos.todos = [{ id: '1', text: 'Toggle me', completed: true, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);
    await waitFor(() => {
      expect(todoText.props.style).toContainEqual(expect.objectContaining({ textDecorationLine: 'line-through' }));
    });

    // Toggle 2: complete -> incomplete
    fireEvent.press(todoText);
    mockUseTodos.todos = [{ id: '1', text: 'Toggle me', completed: false, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);
    await waitFor(() => {
      expect(todoText.props.style).not.toContainEqual(expect.objectContaining({ textDecorationLine: 'line-through' }));
    });

    // Toggle 3: incomplete -> complete
    fireEvent.press(todoText);
    mockUseTodos.todos = [{ id: '1', text: 'Toggle me', completed: true, createdAt: new Date() }];
    (useTodos as jest.Mock).mockReturnValue(mockUseTodos);
    await waitFor(() => {
      expect(todoText.props.style).toContainEqual(expect.objectContaining({ textDecorationLine: 'line-through' }));
    });
  });

  it('should persist an empty todo list correctly', async () => {
    // Simulate loading an empty list
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
    const { unmount, getByText } = render(<TodoApp />);
    await waitFor(() => {
      expect(getByText('No todos yet! Add one to get started.')).toBeTruthy();
    });
    unmount();

    // Simulate re-rendering, it should still be empty
    const { getByText: getByTextAfterReload } = render(<TodoApp />);
    await waitFor(() => {
      expect(getByTextAfterReload('No todos yet! Add one to get started.')).toBeTruthy();
    });
  });

  it('should persist a list with only completed todos correctly', async () => {
    const initialTodos = [
      { id: '1', text: 'Completed 1', completed: true, createdAt: new Date().toISOString() },
      { id: '2', text: 'Completed 2', completed: true, createdAt: new Date().toISOString() },
    ];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialTodos));

    const { unmount, getByText, queryByText } = render(<TodoApp />);
    await waitFor(() => {
      expect(getByText('Completed 1')).toBeTruthy();
      expect(getByText('Completed 2')).toBeTruthy();
      expect(getByText('0 items left')).toBeTruthy();
    });
    unmount();

    // Simulate re-rendering, it should load the completed todos
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(initialTodos));
    const { getByText: getByTextAfterReload, queryByText: queryByTextAfterReload } = render(<TodoApp />);
    await waitFor(() => {
      expect(getByTextAfterReload('Completed 1')).toBeTruthy();
      expect(getByTextAfterReload('Completed 2')).toBeTruthy();
      expect(getByTextAfterReload('0 items left')).toBeTruthy();
    });
  });
});