import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../TodoItem';
import { Todo } from '../../mocks/todos';
import '../../../jest.setup';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    starred: false,
    priority: 'medium',
    tags: ['test'],
    created: new Date(),
    updated: new Date(),
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEditStart: jest.fn(),
    onUpdate: jest.fn(),
    onEditCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo item correctly', () => {
    const { container } = render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    // Test for content presence
    expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
    expect(screen.getByText(mockTodo.description)).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    
    // Test for structure and important elements
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    
    // Test for priority indicator (the colored bar)
    const todoContainer = container.firstChild as HTMLElement;
    expect(todoContainer).toHaveStyle({
      position: 'relative'
    });
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('enters edit mode when edit button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockHandlers.onEditStart).toHaveBeenCalled();
  });

  it('shows edit form with current values when in edit mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTodo.description)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue(mockTodo.priority);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onUpdate with updated values when save button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    const newTitle = 'Updated Title';
    const newDescription = 'Updated Description';
    const newPriority = 'high';

    fireEvent.change(screen.getByDisplayValue(mockTodo.title), {
      target: { value: newTitle },
    });
    fireEvent.change(screen.getByDisplayValue(mockTodo.description), {
      target: { value: newDescription },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: newPriority },
    });

    fireEvent.click(screen.getByText('Save'));

    expect(mockHandlers.onUpdate).toHaveBeenCalledWith(mockTodo.id, {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
    });
  });

  it('calls onEditCancel when cancel button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandlers.onEditCancel).toHaveBeenCalled();
  });

  it('displays correct styles for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem
        todo={completedTodo}
        isEditing={false}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
        onEditStart={mockHandlers.onEditStart}
        onUpdate={mockHandlers.onUpdate}
        onEditCancel={mockHandlers.onEditCancel}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText(completedTodo.title)).toHaveStyle('text-decoration: line-through');
  });
}); 