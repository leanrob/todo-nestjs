'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Todo } from '../mocks/todos';

const TodoItemContainer = styled.div<{ $isEditing?: boolean; $priority: 'low' | 'medium' | 'high' }>`
  background: white;
  border-radius: 8px;
  padding: 16px 16px 16px 20px;
  margin-bottom: 12px;
  box-shadow: ${props => props.$isEditing 
    ? '0 0 0 2px #007AFF, 0 4px 12px rgba(0, 122, 255, 0.2)'
    : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$isEditing ? '#007AFF' : '#eaeaea'};
  font-family: 'Lato', sans-serif;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${props => {
      switch (props.$priority) {
        case 'high': return '#FF3B30';
        case 'medium': return '#FF9500';
        default: return '#34C759';
      }
    }};
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:hover {
    box-shadow: ${props => props.$isEditing
      ? '0 0 0 2px #007AFF, 0 4px 12px rgba(0, 122, 255, 0.2)'
      : '0 2px 6px rgba(0, 0, 0, 0.08)'};
    transform: translateY(-1px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  position: relative;
  min-height: 28px;
`;

const MainContent = styled.div`
  flex-grow: 1;
`;

const EditButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TodoItemContainer}:hover & {
    opacity: 1;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0;
  border: none;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9BA0A6;
    font-weight: 400;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0;
  border: none;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  min-height: 20px;
  margin: 8px 0;
  background: transparent;
  resize: none;
  color: #666;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9BA0A6;
  }
`;

const Select = styled.select`
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  background: white;
  color: #666;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #007AFF;
  }
`;

const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:checked {
    background-color: #007AFF;
    border-color: #007AFF;
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 12px;
    left: 4px;
    top: 1px;
  }

  &:hover {
    border-color: #007AFF;
  }
`;

const Title = styled.h3<{ $completed: boolean }>`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.$completed ? '#9BA0A6' : '#1A1A1A'};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

const Description = styled.p`
  margin: 8px 0;
  font-size: 14px;
  font-weight: 400;
  color: #666;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 12px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #FF3B30;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  opacity: 1;
  padding: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    text-decoration: underline;
    background-color: rgba(255, 59, 48, 0.1);
    border-radius: 4px;
  }
`;

const PriorityLabel = styled.span`
  font-size: 12px;
  color: #666;
  margin-right: 8px;
`;

const FormFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eaeaea;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:last-child {
    background-color: #6c757d;
    
    &:hover {
      background-color: #5a6268;
    }
  }
`;

const SaveAndAddButton = styled(ActionButton)`
  background-color: #34C759;
  margin-left: auto;

  &:hover {
    background-color: #248A3D;
  }
`;

const WarningMessage = styled.div`
  color: #FF3B30;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

/**
 * Props interface for the TodoItem component
 */
interface TodoItemProps {
  /** The todo item to display/edit */
  todo: Todo;
  /** Callback function when a todo is deleted */
  onDelete: (id: string) => void;
  /** Callback function when a todo's completion status is toggled */
  onToggle: (id: string) => void;
  /** Callback function when a todo is updated */
  onUpdate: (id: string, updatedFields: Partial<Todo>) => void;
  /** Whether the todo is in edit mode */
  isEditing?: boolean;
  /** Callback function when edit mode is started */
  onEditStart?: () => void;
  /** Callback function when edit mode is cancelled */
  onEditCancel?: () => void;
  /** Callback function when save and add another is clicked */
  onSaveAndAddAnother?: () => void;
}

/**
 * TodoItem component displays and manages a single todo item.
 * It supports viewing, editing, completing, and deleting todos.
 * 
 * Features:
 * - Inline editing of title, description, and priority
 * - Visual indication of priority levels
 * - Completion status toggle
 * - Delete functionality
 * - Auto-save on click outside
 */
export default function TodoItem({
  todo,
  onDelete,
  onToggle,
  onUpdate,
  isEditing = false,
  onEditStart,
  onEditCancel,
  onSaveAndAddAnother,
}: TodoItemProps) {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedPriority, setEditedPriority] = useState(todo.priority);
  const [showTitleWarning, setShowTitleWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  /**
   * Validates the title and shows warning if empty
   */
  const validateTitle = (title: string): boolean => {
    const isValid = title.trim().length > 0;
    setShowTitleWarning(!isValid);
    return isValid;
  };

  /**
   * Handles saving todo changes
   * Trims whitespace from text fields and calls the update callback
   */
  const handleSave = useCallback(() => {
    const trimmedTitle = editedTitle.trim();
    if (!validateTitle(trimmedTitle)) {
      titleInputRef.current?.focus();
      return;
    }

    onUpdate(todo.id, {
      title: trimmedTitle,
      description: editedDescription.trim(),
      priority: editedPriority,
    });
    onEditCancel?.();
  }, [todo.id, editedTitle, editedDescription, editedPriority, onUpdate, onEditCancel]);

  /**
   * Effect to handle clicking outside the todo item while editing
   * Saves changes if there's a valid title
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isEditing) {
          const trimmedTitle = editedTitle.trim();
          if (!validateTitle(trimmedTitle)) {
            titleInputRef.current?.focus();
            return;
          }
          handleSave();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, editedTitle, handleSave]);

  /**
   * Effect to focus the title input when entering edit mode
   */
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  /**
   * Handles cancelling edit mode
   * Resets form values to original todo values
   */
  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    onEditCancel?.();
  };

  /**
   * Handles keyboard shortcuts:
   * - Enter (without shift): Save changes
   * - Escape: Cancel editing
   * - Ctrl+Enter: Save and add another
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!validateTitle(editedTitle.trim())) {
        return;
      }
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      if (!validateTitle(editedTitle.trim())) {
        return;
      }
      handleSave();
      onSaveAndAddAnother?.();
    }
  };

  if (isEditing) {
    return (
      <TodoItemContainer 
        ref={containerRef} 
        $isEditing={true} 
        $priority={editedPriority}
        role="region"
        aria-label="Edit todo item"
      >
        <Header>
          <Checkbox 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            disabled
            aria-label="Mark todo as complete"
          />
          <MainContent>
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
                if (showTitleWarning) {
                  validateTitle(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter todo title..."
              aria-label="Todo title"
              aria-invalid={showTitleWarning}
              aria-required="true"
              required
            />
            {showTitleWarning && (
              <WarningMessage role="alert">
                Title cannot be empty
              </WarningMessage>
            )}
            <TextArea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter description..."
              aria-label="Todo description"
            />
          </MainContent>
        </Header>
        <FormFooter>
          <PriorityLabel id="priority-label">Priority:</PriorityLabel>
          <Select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as Todo['priority'])}
            aria-labelledby="priority-label"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </FormFooter>
        <ButtonGroup>
          <ActionButton 
            onClick={() => {
              if (!validateTitle(editedTitle.trim())) {
                return;
              }
              handleSave();
            }}
            aria-label="Save changes"
          >
            Save
          </ActionButton>
          <SaveAndAddButton 
            onClick={() => {
              if (!validateTitle(editedTitle.trim())) {
                return;
              }
              handleSave();
              onSaveAndAddAnother?.();
            }}
            aria-label="Save changes and add another todo (Ctrl+Enter)"
          >
            Save & Add Another
          </SaveAndAddButton>
          <DeleteButton 
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete todo: ${todo.title}`}
          >
            Delete
          </DeleteButton>
        </ButtonGroup>
      </TodoItemContainer>
    );
  }

  return (
    <TodoItemContainer 
      $isEditing={isEditing} 
      $priority={todo.priority}
      role="listitem"
      aria-label={`Todo: ${todo.title}`}
    >
      <Header>
        <Checkbox
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          data-testid="todo-checkbox"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <MainContent>
          <Title 
            $completed={todo.completed}
            aria-label={todo.completed ? "Completed todo" : "Incomplete todo"}
          >
            {todo.title}
          </Title>
          {todo.description && (
            <Description role="note">
              {todo.description}
            </Description>
          )}
        </MainContent>
        {!isEditing && (
          <EditButton 
            onClick={onEditStart}
            aria-label={`Edit todo: ${todo.title}`}
          >
            Edit
          </EditButton>
        )}
      </Header>
      {isEditing ? (
        <FormFooter>
          <PriorityLabel id="priority-label">Priority:</PriorityLabel>
          <Select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as Todo['priority'])}
            aria-labelledby="priority-label"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <ButtonGroup>
            <ActionButton onClick={handleSave}>Save</ActionButton>
            <ActionButton onClick={handleCancel}>Cancel</ActionButton>
          </ButtonGroup>
        </FormFooter>
      ) : (
        <Footer>
          <Tags>
            {todo.tags?.map((tag, index) => (
              <Tag key={index} role="note">
                {tag}
              </Tag>
            ))}
          </Tags>
          <DeleteButton 
            onClick={() => onDelete(todo.id)} 
            data-testid="delete-button"
            aria-label={`Delete todo: ${todo.title}`}
          >
            Delete
          </DeleteButton>
        </Footer>
      )}
    </TodoItemContainer>
  );
} 